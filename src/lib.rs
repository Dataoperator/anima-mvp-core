use candid::{CandidType, Deserialize};
use ic_cdk_macros::{query, update};
use candid::Principal;
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Clone, Deserialize)]
pub struct MintResult {
    token_id: u64,
    designation: String,
}

#[derive(CandidType, Clone, Deserialize)]
pub struct PaymentRecord {
    principal: Principal,
    memo: u64,
    timestamp: u64,
    amount: u64,
    status: String,  // "pending" or "completed"
}

#[derive(CandidType, Clone, Deserialize)]
pub struct AnimaData {
    owner: Principal,
    designation: String,
    created_at: u64,
    level: u64,
    experience: u64,
    payment_memo: u64,
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[derive(Default)]
pub struct State {
    animas: HashMap<u64, AnimaData>,
    next_token_id: u64,
    payments: HashMap<u64, PaymentRecord>,
}

#[update]
async fn register_payment(caller: Principal, memo: u64) -> Result<(), String> {
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        let payment = PaymentRecord {
            principal: caller,
            memo,
            timestamp: ic_cdk::api::time(),
            amount: 100_000_000, // 1 ICP in e8s
            status: "pending".to_string(),
        };
        state.payments.insert(memo, payment);
        Ok(())
    })
}

#[update]
async fn mint_anima(caller: Principal, memo: u64) -> Result<MintResult, String> {
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        
        let payment = state.payments.get_mut(&memo)
            .ok_or("No payment record found")?;
            
        if payment.principal != caller {
            return Err("Payment memo doesn't match caller".to_string());
        }
        
        if payment.status != "pending" {
            return Err("Payment already processed".to_string());
        }
        
        payment.status = "completed".to_string();
        let token_id = state.next_token_id;
        state.next_token_id += 1;
        let designation = format!("ANIMA-{:08X}", token_id);
        
        state.animas.insert(token_id, AnimaData {
            owner: caller,
            designation: designation.clone(),
            created_at: ic_cdk::api::time(),
            level: 1,
            experience: 0,
            payment_memo: memo,
        });
        
        Ok(MintResult {
            token_id,
            designation,
        })
    })
}

#[query]
fn get_user_animas(caller: Principal) -> Vec<(u64, AnimaData)> {
    STATE.with(|state| {
        let state = state.borrow();
        state.animas
            .iter()
            .filter(|(_, data)| data.owner == caller)
            .map(|(id, data)| (*id, data.clone()))
            .collect()
    })
}

#[query]
fn get_anima(token_id: u64) -> Option<AnimaData> {
    STATE.with(|state| {
        let state = state.borrow();
        state.animas.get(&token_id).cloned()
    })
}

#[update]
async fn interact(token_id: u64, message: Option<String>) -> Result<InteractionResponse, String> {
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        let anima = state.animas.get_mut(&token_id)
            .ok_or("ANIMA not found")?;
        
        // Simple interaction logic
        anima.experience += 10;
        if anima.experience >= anima.level * 100 {
            anima.level += 1;
        }
        
        Ok(InteractionResponse {
            message: format!("Interaction successful. Experience gained: 10"),
            experience_gained: 10,
        })
    })
}

#[derive(CandidType, Clone, Deserialize)]
pub struct InteractionResponse {
    message: String,
    experience_gained: u64,
}
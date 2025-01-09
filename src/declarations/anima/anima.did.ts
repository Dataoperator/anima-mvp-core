export const idlFactory = ({ IDL }) => {
  const AnimaData = IDL.Record({
    'owner': IDL.Principal,
    'designation': IDL.Text,
    'created_at': IDL.Nat64,
    'level': IDL.Nat64,
    'experience': IDL.Nat64,
    'payment_memo': IDL.Nat64,
  });
  
  const MintResult = IDL.Record({
    'token_id': IDL.Nat64,
    'designation': IDL.Text,
  });

  const InteractionResponse = IDL.Record({
    'message': IDL.Text,
    'experience_gained': IDL.Nat64,
  });

  return IDL.Service({
    'mint_anima': IDL.Func(
      [IDL.Principal],
      [IDL.Variant({ 'Ok': MintResult, 'Err': IDL.Text })],
      [],
    ),
    'get_anima': IDL.Func(
      [IDL.Nat64],
      [IDL.Opt(AnimaData)],
      ['query'],
    ),
    'get_user_animas': IDL.Func(
      [IDL.Principal],
      [IDL.Vec(IDL.Tuple(IDL.Nat64, AnimaData))],
      ['query'],
    ),
    'interact': IDL.Func(
      [IDL.Nat64, IDL.Opt(IDL.Text)],
      [IDL.Variant({ 'Ok': InteractionResponse, 'Err': IDL.Text })],
      [],
    ),
  });
};
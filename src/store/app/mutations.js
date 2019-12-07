export function openWallet(state, payload) {
  state.user.wallet = payload.wallet;
}

export function setNetworkClient(state, payload) {
  state.networkClient = payload.networkClient;
}

export function setColonyClient(state, payload) {
  state.colonyClient = payload.colonyClient;
}

export function setUserRoles(state, payload) {
  state.user.hasRootRole = payload.hasRootRole;
  state.user.hasFundingRole = payload.hasFundingRole;
}

<template>
  <q-dialog
    v-if="typeof token !== 'undefined'"
    v-model="isOpen"
    :persistent="loading"
  >
    <q-card>
      <q-card-section>
        <span class="text-subtitle1 text-weight-medium" v-if="token.name">
          {{ token.name }} Reward Payout
        </span>
      </q-card-section>
      <q-card-section align="right">
        There is
        <strong>
          {{ $web3.utils.fromWei(payout.amount.toString()) }} {{ token.symbol }}
        </strong>
        in this payout.
      </q-card-section>
      <!-- <q-card-section align="right">
        Your share of the rewards pot is:
      </q-card-section>
      <q-card-section align="right">
        <strong> {{ token.payout }} {{ token.symbol }} </strong>
        <q-icon
          v-if="token.token === '0x0000000000000000000000000000000000000000'"
          name="fab fa-ethereum"
          color="black"
          size="sm"
        />
      </q-card-section> -->

      <q-card-actions align="right">
        <!-- <q-btn flat label="Cancel" color="primary" v-close-popup /> -->
        <!-- <q-btn
          v-if="hasRootRole"
          no-caps
          color="secondary"
          @click="submit"
          class="no-shadow"
        >
          <q-icon left size="xs" name="account_balance_wallet" />
          New Distribution
        </q-btn> -->
        <q-btn
          no-caps
          color="negative"
          @click="waive"
          :loading="loading"
          class="no-shadow"
        >
          <q-icon left size="xs" name="account_balance_wallet" />
          Waive
        </q-btn>
        <q-btn
          no-caps
          color="secondary"
          @click="claim"
          :loading="loading"
          class="no-shadow"
        >
          <q-icon left size="xs" name="account_balance_wallet" />
          Claim
        </q-btn>
        <q-btn
          v-if="readyToFinalize"
          no-caps
          @click="finalize"
          class="no-shadow"
        >
          <q-icon left size="xs" name="account_balance_wallet" />
          Finalize
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      loading: false
    };
  },
  computed: {
    isOpen: {
      get() {
        return this.$store.state.app.payoutDialog;
      },
      set(_isOpen) {
        this.$store.commit("app/togglePayoutDialog", _isOpen);
      }
    },
    payout() {
      return this.$store.state.app.selectedPayout;
    },
    hasRootRole() {
      return this.$store.state.app.user.hasRootRole;
    },
    token() {
      return this.$store.getters["app/payoutToken"](this.payout.tokenAddress);
    },
    readyToFinalize() {
      const payoutPeriod = new Date().setDate(
        this.payout.blockTimestamp.getDate() + 60
      );

      return Date.now() > payoutPeriod;
    }
  },
  methods: {
    bnSqrt(bn, isGreater) {
      let a = bn.addn(1).divn(2);
      let b = bn;
      while (a.lt(b)) {
        b = a;
        a = bn
          .div(a)
          .add(a)
          .divn(2);
      }

      if (isGreater && b.mul(b).lt(bn)) {
        b = b.addn(1);
      }
      return b;
    },
    async submit() {
      this.loading = true;
      try {
        await this.$store.dispatch("app/startNextRewardPayout", {
          token: this.token.token
        });

        this.$q.notify({
          color: "positive",
          message: "Successfully started the reward payout."
        });

        this.$store.commit("app/togglePayoutDialog");
      } catch (error) {
        const { message } = error;
        this.$q.notify({ color: "negative", message });
      }
      this.loading = false;
    },
    async claim() {
      this.loading = true;
      const { colonyAddress, colonyClient } = this.$store.state.app;
      const { tokenLockingClient } = colonyClient;
      const {
        payoutId,
        reputationState,
        amount,
        totalTokens,
        colonyWideReputation
      } = this.payout;
      const squareRoots = [0, 0, 0, 0, 0, 0, 0];

      const { skillId } = await colonyClient.getDomain.call({ domainId: 1 });
      const [user] = await this.$web3.eth.getAccounts();
      const { address: token } = await colonyClient.getTokenAddress.call();

      try {
        const { key, value, branchMask, siblings, reputationAmount } = (
          await axios.get(
            `https://colony.io/reputation/mainnet/${reputationState}/${colonyAddress}/${skillId}/${user}`
          )
        ).data;

        const { balance } = await tokenLockingClient.getUserLock.call({
          token,
          user
        });

        squareRoots[0] = this.bnSqrt(this.$web3.utils.toBN(reputationAmount));
        squareRoots[1] = this.bnSqrt(this.$web3.utils.toBN(balance));
        squareRoots[2] = this.bnSqrt(
          this.$web3.utils.toBN(colonyWideReputation),
          true
        );
        squareRoots[3] = this.bnSqrt(this.$web3.utils.toBN(totalTokens), true);
        squareRoots[4] = this.bnSqrt(squareRoots[0].mul(squareRoots[1]));
        squareRoots[5] = this.bnSqrt(squareRoots[2].mul(squareRoots[3]), true);
        squareRoots[6] = this.bnSqrt(this.$web3.utils.toBN(amount));

        await colonyClient.claimRewardPayout.send({
          payoutId,
          squareRoots,
          key,
          value,
          branchMask,
          siblings
        });

        this.$q.notify({
          color: "positive",
          message: "Successfully claimed the reward payout."
        });

        this.$store.commit("app/togglePayoutDialog");
      } catch (error) {
        const { message } = error;
        this.$q.notify({ color: "negative", message });
      }
      this.loading = false;
    },
    async waive() {
      this.loading = true;
      const { colonyClient } = this.$store.state.app;
      const { tokenLockingClient } = colonyClient;
      const [user] = await this.$web3.eth.getAccounts();
      const { address: token } = await colonyClient.getTokenAddress.call();

      const { count: lockId } = await tokenLockingClient.getUserLock.call({
        token,
        user
      });

      try {
        await tokenLockingClient.incrementLockCounterTo.send({
          token,
          lockId: lockId + 1
        });

        this.$q.notify({
          color: "positive",
          message: "Successfully waived the reward payout."
        });
      } catch (error) {
        const { message } = error;
        this.$q.notify({ color: "negative", message });
      }
      this.loading = false;
    },
    async finalize() {
      this.loading = true;
      const { finalizeRewardPayout } = this.$store.state.app.colonyClient;
      const { payoutId } = this.payout;

      await finalizeRewardPayout.send({
        payoutId
      });
      this.loading = false;
    }
  }
};
</script>

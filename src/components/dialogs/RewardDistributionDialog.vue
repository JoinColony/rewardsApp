<template>
  <q-dialog v-if="token != '0x0'" v-model="isOpen" :persistent="loading">
    <q-card>
      <q-card-section>
        <span class="text-subtitle1 text-weight-medium">
          {{ token.name }} Rewards Distribution
        </span>
      </q-card-section>
      <q-card-section align="right">
        There is
        <strong>
          {{ $web3.utils.fromWei(token.balance) }} {{ token.symbol }}
        </strong>
        in the rewards pot.
      </q-card-section>
      <q-card-section align="right">
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
      </q-card-section>

      <q-card-actions align="right">
        <!-- <q-btn flat label="Cancel" color="primary" v-close-popup /> -->
        <q-btn
          v-if="hasRootRole && !payout"
          no-caps
          color="secondary"
          @click="submit"
          class="no-shadow"
        >
          <q-icon left size="xs" name="account_balance_wallet" />
          New Distribution
        </q-btn>
        <q-btn
          no-caps
          v-if="payout"
          color="negative"
          @click="waive"
          class="no-shadow"
        >
          <q-icon left size="xs" name="account_balance_wallet" />
          Waive
        </q-btn>
        <q-btn
          no-caps
          v-if="payout"
          color="secondary"
          @click="claim"
          class="no-shadow"
        >
          <q-icon left size="xs" name="account_balance_wallet" />
          Claim
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
        return this.$store.state.app.rewardDistributionDialog;
      },
      set(_isOpen) {
        this.$store.commit("app/toggleRewardDistributionDialog", _isOpen);
      }
    },
    token() {
      return this.$store.state.app.selectedToken;
    },
    hasRootRole() {
      return this.$store.getters["app/getUser"].hasRootRole;
    },
    payout() {
      return this.$store.getters["app/rewardPayoutInfo"](this.token.token);
    }
  },
  methods: {
    async submit() {
      try {
        await this.$store.dispatch("app/startNextRewardPayout", {
          token: this.token.token
        });

        this.$q.notify({
          color: "positive",
          message: "Successfully started the reward payout."
        });

        this.$store.commit("app/toggleRewardDistributionDialog");
      } catch (error) {
        const { message } = error;
        this.$q.notify({ color: "negative", message });
      }
    },
    async claim() {
      const colonyClient = this.$store.getters["app/getColonyClient"];
      const colonyAddress = this.$store.getters["app/getColonyAddress"];
      const { payoutId, reputationState } = this.payout;
      const squareRoots = [0, 0, 0, 0, 0, 0, 0];

      const { skillId } = await colonyClient.getDomain.call({ domainId: 1 });
      const [userAddress] = await this.$web3.eth.getAccounts();

      try {
        const { key, value, branchMask, siblings, reputationAmount } = (
          await axios.get(
            `https://colony.io/reputation/goerli/${reputationState}/${colonyAddress}/${skillId}/${userAddress}`
          )
        ).data;

        let minABI = [
          // balanceOf
          {
            constant: true,
            inputs: [{ name: "_owner", type: "address" }],
            name: "balanceOf",
            outputs: [{ name: "balance", type: "uint256" }],
            type: "function"
          }
        ];

        const { address } = await colonyClient.getTokenAddress.call();
        const tokenInstance = await new this.$web3.eth.Contract(
          minABI,
          address
        );

        const userTokens = await tokenInstance.methods
          .balanceOf(userAddress)
          .call();

        squareRoots[0] = this.$web3.utils.toBN(
          Math.floor(Math.sqrt(reputationAmount))
        );
        squareRoots[1] = this.$web3.utils.toBN(
          Math.floor(Math.sqrt(userTokens))
        );
        squareRoots[2] = this.$web3.utils.toBN(
          Math.ceil(Math.sqrt(this.payout.colonyWideReputation))
        );
        squareRoots[3] = this.$web3.utils.toBN(
          Math.ceil(Math.sqrt(this.payout.totalTokens))
        );
        squareRoots[4] = this.$web3.utils.toBN(
          Math.floor(Math.sqrt(reputationAmount * userTokens))
        );
        squareRoots[5] = this.$web3.utils.toBN(
          Math.ceil(
            Math.sqrt(
              this.payout.colonyWideReputation * this.payout.totalTokens
            )
          )
        );
        squareRoots[6] = this.$web3.utils.toBN(
          Math.floor(Math.sqrt(this.payout.amount))
        );

        console.log(squareRoots);//eslint-disable-line

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

        this.$store.commit("app/toggleRewardDistributionDialog");
      } catch (error) {
        const { message } = error;
        this.$q.notify({ color: "negative", message });
      }
    },
    async waive() {}
  }
};
</script>

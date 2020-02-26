<template>
  <q-dialog v-model="isOpen" :persistent="loading">
    <q-card>
      <q-card-section>
        <div class="text-h6">Lock/Unlock {{ tokenInfo.name }}</div>
      </q-card-section>

      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="secondary"
        indicator-color="secondary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="lock" label="Lock" />
        <q-tab name="unlock" label="Unlock" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="lock" class="q-pa-none">
          <q-card-section>
            <q-input
              label="Amount"
              v-model="amountToLock"
              autofocus
              @keyup.enter="submitLock"
              :disable="loading"
              :suffix="tokenInfo.symbol"
              type="number"
              color="secondary"
            />
            <div class="text-caption" align="right">
              Available:
              {{ availableBalance + " " + tokenInfo.symbol }}
            </div>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn
              no-caps
              color="secondary"
              label="Confirm"
              @click="submitLock"
              :loading="loading"
              class="no-shadow"
            />
          </q-card-actions>
        </q-tab-panel>

        <q-tab-panel name="unlock" class="q-pa-none">
          <q-card-section>
            <q-input
              label="Amount"
              v-model="amountToUnlock"
              autofocus
              @keyup.enter="submitUnlock"
              :disable="loading"
              :suffix="tokenInfo.symbol"
              type="number"
              color="secondary"
            />
            <div class="text-caption" align="right">
              Locked:
              {{
                $web3.utils.fromWei(amountLocked.toString()) +
                  " " +
                  tokenInfo.symbol
              }}
            </div>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn
              no-caps
              color="secondary"
              label="Confirm"
              @click="submitUnlock"
              :loading="loading"
              class="no-shadow"
            />
          </q-card-actions>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      amountToLock: "",
      amountToUnlock: "",
      tab: "lock",
      tokenInfo: { name: "", symbol: "", address: "" },
      amountLocked: "",
      availableBalance: ""
    };
  },
  async mounted() {
    const [user] = await this.$web3.eth.getAccounts();
    const colonyClient = this.$store.getters["app/getColonyClient"];
    const tokenClient = colonyClient.tokenClient;
    const tokenLockingClient = colonyClient.tokenLockingClient;
    const { address: token } = await colonyClient.getTokenAddress.call();

    this.tokenInfo = await this.$store.state.app.colonyClient.tokenClient.getTokenInfo.call();
    this.tokenInfo.address = token;

    this.availableBalance = this.$web3.utils.fromWei(
      (
        await tokenClient.getBalanceOf.call({
          sourceAddress: user
        })
      ).amount.toString()
    );

    this.amountLocked = (
      await tokenLockingClient.getUserLock.call({
        token,
        user
      })
    ).balance;
  },
  computed: {
    isOpen: {
      get() {
        return this.$store.state.app.lockTokensDialog;
      },
      set(_isOpen) {
        this.$store.commit("app/toggleLockTokensDialog", _isOpen);
      }
    }
  },
  methods: {
    async submitLock() {
      this.loading = true;

      try {
        const amount = this.$web3.utils.toBN(
          this.$web3.utils.toWei(this.amountToLock)
        );

        // Use tokenClient to approve the tokenLockingClient for the specified token amount.
        const address = this.$store.state.app.colonyClient.tokenLockingClient
          .contract.address;
        await this.$store.state.app.colonyClient.tokenClient.approve.send({
          address,
          amount
        });

        // Use the tokenLockingClient to deposit the specified amount of tokens.
        const {
          address: token
        } = await this.$store.state.app.colonyClient.getTokenAddress.call();
        await this.$store.state.app.colonyClient.tokenLockingClient.deposit.send(
          {
            token,
            amount
          }
        );

        this.$q.notify({
          color: "positive",
          message: "Successfully locked tokens."
        });

        this.$store.commit("app/toggleLockTokensDialog");
      } catch (error) {
        const { message } = error;
        this.$q.notify({ color: "negative", message });
      }

      this.loading = false;
    },
    async submitUnlock() {
      this.loading = true;

      try {
        this.$q.notify({
          color: "positive",
          message: "Successfully unlocked tokens."
        });

        this.$store.commit("app/toggleLockTokensDialog");
      } catch (error) {
        const { message } = error;
        this.$q.notify({ color: "negative", message });
      }

      this.loading = false;
    }
  }
};
</script>

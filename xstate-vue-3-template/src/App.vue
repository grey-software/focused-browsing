<template>
  <div id="app">
    <h1>XState Vue 3 Template</h1>
    <h2>Fork this template!</h2>
    <button @click="send('TOGGLE')">
      Click me ({{ state.matches("active") ? "✅" : "❌" }})
    </button>
    <code>
      Toggled
      <strong>{{ state.context.count }}</strong> times
    </code>
  </div>
</template>

<script>
import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/vue";

const toggleMachine = createMachine({
  id: "toggle",
  initial: "inactive",
  context: {
    count: 0,
  },
  states: {
    inactive: {
      on: { TOGGLE: "active" },
    },
    active: {
      entry: assign({ count: (ctx) => ctx.count + 1 }),
      on: { TOGGLE: "inactive" },
    },
  },
});

export default {
  setup() {
    const { state, send } = useMachine(toggleMachine);
    return {
      state,
      send,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

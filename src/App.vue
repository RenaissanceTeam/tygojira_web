<template>
  <div id="app">
    <Header />
    <router-view/>
  </div>
</template>

<script>
import Header from './components/layout/Header.vue'

export default {
  name: 'app',
  components: {
    Header
  }
}
</script>

<style lang="scss">
  // Import Bulma's core
  @import "~bulma/sass/utilities/_all";

  // Set your colors
  $primary: #2c3e50; // I don't know why this doesn't work
  $primary-invert: findColorInvert($primary);
  $twitter: #2c3e50;
  $twitter-invert: findColorInvert($twitter);

  // Setup $colors to use as bulma classes (e.g. 'is-twitter')
  $colors: (
          "white": ($white, $black),
          "black": ($black, $white),
          "light": ($light, $light-invert),
          "dark": ($dark, $dark-invert),
          "primary": ($primary, $primary-invert),
          "info": ($info, $info-invert),
          "success": ($success, $success-invert),
          "warning": ($warning, $warning-invert),
          "danger": ($danger, $danger-invert),
          "twitter": ($twitter, $twitter-invert)
  );

  // Links
  $link: $primary;
  $link-invert: $primary-invert;
  $link-focus-border: $primary;

  // Import Bulma and Buefy styles
  @import "~bulma";
  @import "~buefy/src/scss/buefy";

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

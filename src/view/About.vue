<template>
  <div class="about">
    <h1>About</h1>
    <p>This is the tygojira_web app v0.0.0.0.0.0.0.0.0.1. It is part of the hse tygojira group project</p>
    <p>mode={{title}}</p>
  </div>
</template>

<script>
  export default {
    name: 'About',
    data() {
      return {
        title: process.env.NODE_ENV
      }
    }
  }
</script>
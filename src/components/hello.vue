<template>
  <div>
    <h1>hello world!</h1>
    <p>{{ width }}</p>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        width: 100
      }
    },
    created () {
      console.log(this.width, 'width')
    }
  }
</script>

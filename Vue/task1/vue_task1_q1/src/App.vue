<template>
    <div id="app">
        <h1>
            {{ message }}
        </h1>
    </div>
</template>

<script>
export default {
    name: 'app',
    computed: {
        message: function () {
            return this.$store.state.message;
        },
    },
};
</script>

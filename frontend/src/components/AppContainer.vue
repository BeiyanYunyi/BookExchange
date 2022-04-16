<template>
  <div :class="$style.outerContainer">
    <div :class="$style.innerContainer">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style module>
.outerContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.innerContainer {
  max-width: 80rem;
}
</style>

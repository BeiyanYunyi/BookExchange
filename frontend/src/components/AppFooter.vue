<template>
  <NLayout embedded :class="$style.footer">
    <NDescriptions :column="3" :class="$style.description">
      <NDescriptionsItem label="合办社团">
        益行社
        <br />
        DH 互联网工作室
      </NDescriptionsItem>
      <NDescriptionsItem label="技术支持">DH 互联网工作室<br />科学技术协会</NDescriptionsItem>
    </NDescriptions>
    <NP :class="$style.copyleft">
      ©2023 北雁云依 以 AGPLv3 协议
      <NA href="https://github.com/BeiyanYunyi/BookExchange">开源</NA>
    </NP>
  </NLayout>
</template>
<script setup lang="ts"></script>
<style module>
.copyleft {
  text-align: center;
}
.footer {
  margin-top: 0.5rem;
  height: 30vh;
}
.description {
  margin: 1rem 1rem 0 1rem;
}
</style>

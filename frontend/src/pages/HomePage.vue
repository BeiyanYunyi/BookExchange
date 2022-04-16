<template>
  <AppBooks :books="bookInfo" />
</template>
<script setup lang="ts">
import AppBooks from '../components/AppBooks.vue';
import IFrontendBook from '../../../types/IFrontendBook';

const bookInfo: IFrontendBook[] = [
  {
    id: '114514',
    title: '论人类不平等的起源和基础',
    author: '让·雅克·卢梭',
    desc: '该书探讨了社会不平等的原因及克服的方法，批判了封建等级关系。作者认为生产的发展和私有制的产生，使人类脱离了“自然状态”，产生了贫富不均的社会现象；揣测到了矛盾斗争会发生对立面转化，以及发展是一个螺旋式上升的过程；认识到私有制是社会不平等的根源，又认为每人有少量私有财产是社会平等的基础。',
    owner: { id: '1919810', name: '李北群', stuNum: '234567', collage: '行政楼', avatar: null },
    tags: ['社科', '经典'],
    img: '/test.jpg',
  },
  {
    id: '332341',
    title: '家庭、私有制和国家的起源',
    author: '弗里德里希·恩格斯',
    desc: '分析了人类早期的历史，揭示了原始社会制度解体和以私有制为基础的阶级社会形成的过程，阐明了阶级社会的一般特征；弄清了各个不同社会形态中家庭关系发展的特点；剖析了国家的起源和实质，证明了国家由阶级产生，随着阶级的消失，国家也必将消亡。',
    owner: {
      id: '997696',
      name: '侯国玉',
      stuNum: '234567',
      collage: '马克思主义学院',
      avatar: null,
    },
    tags: ['社科', '马克思主义'],
    img: null,
  },
];
</script>

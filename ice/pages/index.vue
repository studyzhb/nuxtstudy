<template lang='pug'>
.container
  .house(ref='house')
    .items(v-for='(item,index) in houses',:key='index',@click='showHouse(item)')
      .desc
        .words {{item.words}}
        .cname {{item.cname}}
        .name {{item.name}}
  .character
    .title 主要人物
    .section
      .items(v-for='(item,index) in characters',:key='index',@click='showCharacter(item)')
        img(:src="item.profile")
        .desc
          .cname {{item.cname}}
          .name {{item.name}}
          .playedBy {{item.playedBy}}
  .city
    .title 维斯特洛
    .intro 
    | 座楼手动撒开了发上来了按时发什么法拉看什么散发萨斯ga.gagasf,nas你看就看你看见你发就看见你就爱上的你就爱上你就可能大家看上的缴纳时间你的沮丧呢那个
    .items(v-for='(item,index) in cities',:key='index')
      .title {{item.title}}
      .body {{item.body}}

</template>

<script>
import {mapState} from 'vuex'
export default {
  head(){
    return {
      title:'冰火脸谱'
    }
  },
  computed:{
    ...mapState([
      'houses',
      'characters',
      'cities'
    ])
  },
  methods:{
    showHouse(item){
      this.$router.push({
        path:'/house',
        query:{
          id:item._id
        }
      })
    },
    showCharacter(item){
      this.$router.push({
        path:'/character',
        query:{
          id:item._id
        }
      })
    }
  },
  beforeCreate(){
    this.$store.dispatch('fetchHouses')
    this.$store.dispatch('fetchCharacters')
    this.$store.dispatch('fetchCities')
  }
}
</script>


<style scoped>
.title
{
  margin: 50px 0;
}
</style>

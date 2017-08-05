<template lang="pug">

.container
    .house-media
        .desc
            .words {{house.words}}
            .name {{house.name}}
    .house-body
        .title {{house.cname}}
        .body {{house.intro}}
        .title 主要角色
        .items(v-for='(item,index) in house.swornMembers',:key='index')
            .members
                img(:src='item.profile')
                .desc
                    .cname {{item.cname}}
                    .intro {{item.text}}
    
    .house-history(v-for='(item,index) in house.sections',:key='index')
        .title {{item.title}}
        .content(v-for='text in item.content') {{text}}
</template>

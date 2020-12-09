<template>
<div id="right-view">
    <el-row>
        <el-table id="total-score" :data="tableData.slice(0,10)" style="width: 100%;margin-left:20px" :default-sort="{prop: 'indexation', order: 'descending'}">
            <el-table-column type="index" label="排名" width="100">
            </el-table-column>
            <el-table-column prop="province" label="省份" width="120">
            </el-table-column>
            <el-table-column prop="indexation" label="改革指数" sortable :sort-method="(a,b)=>{return a.indexation - b.indexation}" width="180">
            </el-table-column>
        </el-table>
    </el-row>
</div>
</template>

<script>
export default {
    props: {
        tableData: Array
    },
    mounted:{
        
    }
}
</script>

<style lang="scss">
</style>

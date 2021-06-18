<template>
  <div class="work-flow">
    <uni-form-custom v-if="rules" ref="formRef" class="main-body" :model="subFormData" :rules="rules">
      <uni-card isForm>
        <template v-for="(item, i) in formDataList">
          <!-- {{ i > cIndex ? i : '' }} -->
          <WorkFormItem :key="i" :itemData="item" :disabled="viewFormData" />
        </template>
      </uni-card>
    </uni-form-custom>
  </div>
</template>

<script>
import Api from '@/pages/projectOA/api'
export default {
  props: {
    // 表单id
    formId: {
      type: String,
      default: ''
    },
    targetId: {
      type: String,
      default: ''
    },
    // 加载表单数据
    formDataJson: {
      type: [Object, String],
      default: ''
    },
    // 预览表单数据
    viewFormData: {
      type: Boolean,
      default: false
    }
  },
  data() {
    //这里存放数据
    return {
      formDataList: [],
      subFormData: {},
      cIndex: 1,
      rules: ''
    }
  },
  mounted() {
    this.init()
  },
  // 方法集合
  methods: {
    init() {
      if (this.formDataJson) {
        this.formDataList = this.formArray(this.formDataJson.list)
        this.formDataList.map(e => {})
      }
      this.getFormDetail()
      this.getFormFillDetail()
    },
    // 处理数据
    formArray(array) {
      let rules = {}
      array.map(e => {
        let defaultValue = e.options.defaultValue
        // 特殊处理图片数据
        if (e.el === 'uploadImage' || e.el === 'uploadFile') {
          if (defaultValue) {
            e.options.defaultValue.map(f => {
              f.fileKey = f.id
            })
          }
        }
        rules[e.model] = { required: e.options.required }
        this.rules = rules
      })
      return array
    },
    // 获取表单详情
    async getFormDetail() {
      if (!this.formId) {
        return
      }
      let result = await Api.getFormDetail(this.formId)
      let datas = result.data
      let template = datas.template
        ? JSON.parse(datas.template)
        : {
            list: []
          }
      let list = this.formArray(template.list)
      this.formDataList = list
    },
    // 获取表单数据详情
    async getFormFillDetail() {
      if (!this.targetId) {
        return
      }
      let result = await Api.getFormFillDetail(this.targetId)
      let datas = result.data
      let template = datas.template
        ? JSON.parse(datas.template)
        : {
            list: []
          }
      let list = this.formArray(template.list)
      this.formDataList = list
      // console.log('获取表单详情22', this.formDataList, this.formDataList[this.cIndex + 1])
    },
    // 返回数据
    async getJSON() {
      let exceptList = ['grid', 'report', 'tabs']
      this.formDataList.map(e => {
        let defaultValue = e.options.defaultValue
        // 特殊处理表格数据
        if (e.type === 'table') {
          let list = []
          defaultValue &&
            defaultValue.map(f => {
              let params = {}
              f.map(g => {
                params[g.model] = g.options.defaultValue
              })
              list.push(params)
            })
          defaultValue = _.cloneDeep(list)
        }
        // 特殊处理 栅格布局/选项卡数据 数据
        if (e.type === 'grid' || e.type === 'tabs') {
          defaultValue &&
            defaultValue.map(f => {
              f.list.map(g => {
                this.subFormData[g.model] = g.options.defaultValue
              })
            })
        }
        // 特殊处理表格布局数据
        if (e.type === 'report') {
          defaultValue &&
            defaultValue.map(f => {
              f.columns.map(g => {
                g.list.map(h => {
                  this.subFormData[h.model] = h.options.defaultValue
                })
              })
            })
        }
        if (!exceptList.includes(e.type)) {
          this.subFormData[e.model] = defaultValue
        }
      })
      await this.$refs.formRef.validate()
      return this.subFormData
    }
  }
}
</script>
<style lang="less" scoped>
.work-flow {
  margin-top: 24px;
}
</style>

<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-form-custom ref="form" :model="form" :rules="rules" class="border-top mt20">
          <uni-card isForm>
            <uni-form-item label="任务内容" prop="taskContent">
              <textarea v-model.trim="form.taskContent" auto-height placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="任务重要性" prop="taskLevel" isLink>
              <uni-select v-model="form.taskLevel" :options="importList" />
            </uni-form-item>
          </uni-card>

          <uni-card v-if="!id" isForm>
            <uni-form-item label="任务类型" prop="taskType" type="textarea" align="left">
              <radio-group v-model="form.taskType" @change="changeType">
                <label v-for="item in typeList" :key="item.value" class="radio-item">
                  <radio :value="item.value" :checked="item.value === form.taskType" />{{ item.label }}
                </label>
              </radio-group>
            </uni-form-item>
          </uni-card>

          <uni-card v-if="form.taskType === '1'" isForm>
            <uni-form-item label="任务截止时间" prop="taskEndTime" isLink isRequired>
              <uni-date-picker
                v-model="form.taskEndTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                fields="second"
                mode="date"
              ></uni-date-picker>
            </uni-form-item>
            <uni-form-item label="任务接收人" prop="executor" isLink isRequired>
              <uni-select-user v-model="form.executor" />
            </uni-form-item>
          </uni-card>
        </uni-form-custom>

        <template v-if="form.taskType === '2'">
          <block v-for="(item, index) in detailAddDTOList" :key="index">
            <p class="card-title">
              <span>子任务{{ index + 1 }}</span>
              <span class="btn" @click="removeSub(index)">删除</span>
            </p>
            <uni-form-custom :ref="index" :model="item" :rules="rules" class="mt20">
              <uni-card isForm>
                <uni-form-item label="子任务内容" prop="taskContent" isRequired>
                  <textarea v-model.trim="item.taskContent" auto-height placeholder="请输入" />
                </uni-form-item>
                <uni-form-item label="任务截止时间" prop="taskEndTime" isLink isRequired>
                  <uni-date-picker
                    v-model="item.taskEndTime"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    fields="second"
                    mode="date"
                  ></uni-date-picker>
                </uni-form-item>
                <uni-form-item label="任务接收人" prop="executor" isLink isRequired>
                  <uni-select-user v-model="item.executor" />
                </uni-form-item>
              </uni-card>
            </uni-form-custom>
          </block>
        </template>

        <footer v-if="form.taskType === '2'" class="footer">
          <uni-icons class="icon" color="#2EB04C" type="plus-filled" size="24" @click="handleAdd" />
        </footer>

        <view class="btn-wrapper">
          <button class="button" type="primary" @click="handleSave">保存</button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import Api from './api'
import importList from './lib/importList'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      id: null,
      form: {},
      itemForm: {},
      importList,
      typeList: [
        {
          label: '单一任务',
          value: '1'
        },
        {
          label: '多任务',
          value: '2'
        }
      ],
      rules: {
        taskContent: { required: true },
        taskLevel: { required: true },
        taskType: { required: true },
        taskEndTime: { required: true },
        executor: { required: true }
      },
      detailAddDTOList: [{}, {}],
      isSave: false // 是否保存
    }
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id
      this.refresh()
      this.$utils.setTitle('编辑')
    }
  },
  // 返回拦截
  onBackPress(obj) {
    if (!this.isSave) {
      this.$utils.addGoBack(() => {
        this.isSave = true
      })
    }
    return !this.isSave
  },
  methods: {
    async refresh() {
      let res = await Api.detail(this.id)
      let cloneData = _.cloneDeep(res.data)
      this.form = {
        ...res.data,
        ...{
          taskType: cloneData.taskType ? '2' : '1'
        }
      }
      this.detailAddDTOList = cloneData.taskResultDetailDTOList
    },
    // 点击保存按钮
    async handleSave() {
      await this.$refs.form.validate()
      if (this.form.taskType === '2') {
        await Promise.all(
          this.detailAddDTOList.map((item, i) => {
            return this.$refs[i][0].validate()
          })
        )
      }
      let param = _.cloneDeep(this.form)
      if (param.taskType === '2') {
        if (this.detailAddDTOList.length < 2) {
          this.$utils.showToast('子任务不能小于2个')
          return
        }
        if (this.detailAddDTOList.length > 20) {
          this.$utils.showToast('子任务最多20个')
          return
        }
        let dateAry = this.detailAddDTOList.map(r => r.taskEndTime)
        let maxDate = dateAry.sort((a, b) => (moment(a).isAfter(b) ? 1 : -1))[0]

        param = {
          ...param,
          ...{ detailAddDTOList: this.detailAddDTOList, taskEndTime: maxDate }
        }
      }
      param.taskType = param.taskType === '2'
      this.id ? await Api.update(param) : await Api.add(param)
      this.$utils.showToast('操作成功')
      this.isSave = true
      setTimeout(() => {
        this.$utils.goBack(1)
      }, 1000)
    },
    changeType(e) {
      this.form = {
        ...this.form,
        ...{ taskType: e.detail.value }
      }
    },
    removeSub(i) {
      this.detailAddDTOList.splice(i, 1)
    },
    handleAdd() {
      this.detailAddDTOList.push({})
    }
  }
}
</script>

<style lang="less" scoped>
.mt20 + .mt20 {
  margin-top: 50rpx;
}
.btn-wrapper {
  display: flex;
  .button {
    flex: 1;
    margin: 0 20rpx;
  }
}
.radio-item {
  display: block;
  & + .radio-item {
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1px solid #eee;
  }
}
.card-title {
  display: flex;
  justify-content: space-between;
  padding: 0 40rpx 10rpx 40rpx;
  .btn {
    color: red;
  }
}
.footer {
  margin-top: 10rpx;
  text-align: center;
}
</style>

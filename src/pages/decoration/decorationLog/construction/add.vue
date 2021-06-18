<template>
  <view class="main is-white">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules" class="mt20">
        <uni-card isForm>
          <uni-form-item label="编制日期" prop="diaryDate">
            <uni-date-picker v-model="form.diaryDate" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
        </uni-card>
        <uni-card isForm title="施工人员">
          <view slot="title"><span class="common-button" type="primary" @click="openDrawer">添加人员</span></view>
          <view v-if="personList.length" class="person-list">
            <view v-for="(item, index) of personList" :key="item.id" class="person-item">
              <span class="content">
                <span class="label">施工人员{{ index + 1 }}:</span>
                <span class="info"
                  ><span>{{ item.cardNumber }}</span>
                  <span>{{ item.name }}</span>
                  <span> {{ $getLabel(workType, item.workType) }}</span>
                  <span>{{ item.labourCompanyName }}</span>
                  <span>{{ item.groupName }}</span>
                </span>
              </span>
              <span class="opt">
                <span class="common-button" type="primary" @click="deletePerson(index, item)">删除</span></span
              >
            </view>
          </view>
          <uni-form-item label="施工人数" prop="constructionPersonNumber">
            <input v-model.number="form.constructionPersonNumber" placeholder="请输入" @blur="handlePersonCountBlur" />
          </uni-form-item>
        </uni-card>
        <!-- 今日天气信息 -->
        <view class="mt20">
          <uni-card isForm title="今日天气">
            <uni-form-item label="今日天气" :border="false">
              <input v-model.trim="form.todayWeather" placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="上午温度(℃)" prop="constructionPersonCount">
              <input v-model.number="form.morningWeather" placeholder="请输入温度" />
            </uni-form-item>
            <uni-form-item label="午间温度(℃)" prop="constructionPersonCount">
              <input v-model.number="form.noonWeather" placeholder="请输入温度" />
            </uni-form-item>
            <uni-form-item label="下午温度(℃)" prop="constructionPersonCount">
              <input v-model.number="form.afternoonWeather" placeholder="请输入温度" />
            </uni-form-item>
          </uni-card>
        </view>
        <!-- 进度状况 -->
        <view class="mt20">
          <uni-card isForm title="进度状况">
            <uni-form-item
              label="施工工程及内容"
              :border="false"
              align="left"
              class="block-item"
              prop="constructionContent"
            >
              <textarea v-model.trim="form.constructionContent" :maxlength="-1" placeholder="请填写内容" auto-height />
            </uni-form-item>
            <uni-form-item label="质量情况" align="left" class="block-item" prop="qualitySituation">
              <textarea v-model.trim="form.qualitySituation" :maxlength="-1" placeholder="请填写内容" auto-height />
            </uni-form-item>
            <uni-form-item label="安全情况" align="left" class="block-item" prop="safetySituation">
              <textarea v-model.trim="form.safetySituation" :maxlength="-1" placeholder="请填写内容" auto-height />
            </uni-form-item>
            <uni-form-item label="进度情况" align="left" class="block-item" prop="scheduleSituation">
              <textarea v-model.trim="form.scheduleSituation" :maxlength="-1" placeholder="请填写内容" auto-height />
            </uni-form-item>
            <uni-form-item label="材料进场情况" align="left" class="block-item" prop="materialEnterSituation">
              <textarea
                v-model.trim="form.materialEnterSituation"
                :maxlength="-1"
                placeholder="请填写内容"
                auto-height
              />
            </uni-form-item>
          </uni-card>
        </view>
        <!-- 附件上传 -->
        <view class="mt20">
          <uni-card isForm title="其他">
            <uni-form-item label="抄送人" isLink prop="copyToPersonIds">
              <uni-select-user v-model="form.copyToPersonIds" :name.sync="form.copyToPersonNames" multiple />
            </uni-form-item>
            <uni-form-item label="备注" type="textarea" align="left" class="block-item" prop="remark">
              <textarea v-model.trim="form.remark" :maxlength="200" placeholder="请输入备注信息" auto-height />
            </uni-form-item>
            <uni-form-item class="file-item" label="上传附件" prop="fileIds">
              <uni-attachment v-model="form.fileIds" edit></uni-attachment>
            </uni-form-item>
          </uni-card>
        </view>
      </uni-form-custom>
    </view>
    <!-- 进度侧边栏start -->
    <uni-drawer ref="userList" :width="700" mode="right">
      <user-list :checked="checkedValue" @selected="handleUserSelected"></user-list>
    </uni-drawer>
    <view class="btn-wrapper">
      <button class="button" type="primary" :loading="isLoading" @click="handleSubmit">保存</button>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import UserList from './user-list'
import Api from './api'
export default {
  components: {
    UserList
  },
  data() {
    return {
      form: {
        diaryDate: '',
        constructionPersonNumber: 0,
        todayWeather: '',
        afternoonWeather: null,
        morningWeather: null,
        noonWeather: null,
        constructionContent: '',
        qualitySituation: '',
        safetySituation: '',
        scheduleSituation: '',
        materialEnterSituation: '',
        remark: '',
        fileIds: ''
      },
      rules: {
        diaryDate: { required: true },
        todayWeather: { required: true },
        constructionContent: { required: true },
        qualitySituation: { required: true },
        safetySituation: { required: true },
        scheduleSituation: { required: true },
        materialEnterSituation: { required: true }
      },
      personList: [], //施工人员列表
      checkedValue: [],
      isLoading: false,
      isSave: false // 是否保存
    }
  },
  computed: {
    ...mapGetters(['projectId', 'userName', 'userId']),
    // 天气信息
    weatherInfo() {
      return this.$store.state.project.weatherInfo
    },
    workType() {
      return this.$getArgList('workType') || []
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
  onLoad(options) {
    if (options.id) {
      this.id = options.id
      this.$utils.setTitle('编辑')
      this.getDetail()
    }
  },
  mounted() {
    this.form.projectId = this.projectId
    this.init()
  },
  methods: {
    // 初始化
    init() {
      Object.assign(this.form, {
        diaryDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        todayWeather: this.weatherInfo.weather,
        morningWeather: this.weatherInfo.temperature,
        noonWeather: this.weatherInfo.temperature,
        afternoonWeather: this.weatherInfo.temperature
      })
    },
    //选择人员
    openDrawer() {
      this.$refs.userList.open()
    },
    //详情
    async getDetail() {
      let res = await Api.getLogDetail(this.id)
      this.form = { ...res.data }
      this.checkedValue = res.data.employeeDTOList.map(item => item.id)
      this.personList = res.data.employeeDTOList || []
    },
    //选中施工人员，计算施工人数
    handleUserSelected(data) {
      this.personList = data ? data.checked : []
      this.checkedValue = data ? data.checkedValue : []
      this.form.constructionPersonNumber = data ? data.checkedValue.length : null
      this.$refs.userList.close()
    },
    deletePerson(index, item) {
      this.personList.splice(index, 1)
      this.checkedValue.splice(index, 1)
      this.form.constructionPersonNumber--
    },
    // 手动输入施工人数时，验证施工人数不能小于选择的人员数量
    handlePersonCountBlur() {
      if (!this.checkedValue.length) return
      let selectedPersonCount = this.checkedValue.length
      if (selectedPersonCount > this.form.constructionPersonNumber) {
        this.$utils.showToast('请输入正确的施工人数')
      }
    },
    // 添加数据
    async handleSubmit() {
      await this.$refs.form.validate()
      let selectedPersonCount = this.checkedValue.length
      if (selectedPersonCount > this.form.constructionPersonNumber) {
        this.$utils.showToast('请输入正确的施工人数')
      }
      this.isLoading = true
      const form = _.cloneDeep(this.form)
      form.constructionPersonId = this.checkedValue.join(',')
      this.id ? await Api.updateLog(form) : await Api.add(form)
      this.isLoading = false
      this.isSave = true
      setTimeout(() => {
        this.$utils.goBack(1)
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
</style>

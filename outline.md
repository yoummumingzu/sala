# 销售提成助手 - 项目文件结构

## 文件架构

```
/mnt/okcomputer/output/
├── index.html              # 主工作台页面 (Dashboard)
├── projects.html           # 项目管理页面
├── calculator.html         # 提成计算器页面  
├── analytics.html          # 数据分析页面
├── main.js                 # 主要JavaScript逻辑
├── resources/              # 资源文件夹
│   ├── bg-pattern.svg      # 背景图案
│   └── icons/              # 图标文件
└── README.md               # 项目说明文档
```

## 页面功能分配

### index.html - 个人工作台
**核心功能**:
- 年度目标进度环形图 (ECharts.js)
- 本月关键指标卡片展示
- 快速操作按钮区域
- 最近项目时间线
- 动态粒子背景效果 (p5.js)

**视觉特效**:
- 数字滚动动画 (Anime.js)
- 卡片悬停发光效果
- 进度条填充动画
- 背景粒子系统

### projects.html - 项目管理
**核心功能**:
- 项目卡片网格布局
- 添加/编辑项目模态框
- 项目筛选和搜索
- 状态标签和分类

**交互特性**:
- 卡片拖拽排序
- 实时搜索过滤
- 表单验证动画
- 状态切换效果

### calculator.html - 提成计算器
**核心功能**:
- 可视化提成规则设置
- 实时计算结果显示
- 多种提成模式切换
- 计算历史记录

**视觉元素**:
- 规则设置滑块控件
- 计算过程动画展示
- 结果高亮显示
- 图表化提成构成

### analytics.html - 数据分析
**核心功能**:
- 业绩趋势折线图
- 提成构成饼图
- 客户分析雷达图
- 多维度数据筛选

**数据可视化**:
- 交互式图表 (ECharts.js)
- 数据点悬停详情
- 时间范围选择器
- 动态数据更新

## JavaScript模块设计

### main.js 核心模块
```javascript
// 数据管理模块
const DataManager = {
    // localStorage操作
    // 数据验证和格式化
    // 导入导出功能
}

// 提成计算引擎
const CommissionCalculator = {
    // 阶梯跳点计算
    // 固定比例计算
    // 超额奖励计算
    // 规则配置管理
}

// 图表渲染模块
const ChartRenderer = {
    // ECharts图表初始化
    // 数据更新动画
    // 响应式图表调整
}

// UI交互模块
const UIController = {
    // 页面切换动画
    // 表单交互处理
    // 模态框管理
    // 通知系统
}

// 视觉效果模块
const VisualEffects = {
    // Anime.js动画控制
    // p5.js背景效果
    // 粒子系统管理
    // 滚动触发动画
}
```

## 数据结构设计

### 项目数据结构
```javascript
{
    id: "unique_id",
    projectName: "项目名称",
    customer: "客户信息", 
    amount: 500000,
    dealDate: "2024-01-15",
    productType: "产品类型",
    commissionRate: 0.08,
    status: "已完成",
    notes: "备注信息",
    createdAt: "2024-01-15T10:00:00Z"
}
```

### 提成规则结构
```javascript
{
    ruleName: "2024年销售提成规则",
    calculationMode: "ladder", // ladder, fixed, excess
    ladderRules: [
        {min: 0, max: 100000, rate: 0.05},
        {min: 100000, max: 500000, rate: 0.08},
        {min: 500000, max: Infinity, rate: 0.12}
    ],
    fixedRate: 0.06,
    excessRules: {
        baseTarget: 1000000,
        baseRate: 0.05,
        excessRate: 0.10
    }
}
```

## 响应式断点设计
- **桌面端**: 1200px+ (完整功能布局)
- **平板端**: 768px-1199px (适配触摸操作)
- **移动端**: 320px-767px (单列布局优化)
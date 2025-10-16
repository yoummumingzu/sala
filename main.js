// 销售提成助手 - 主要JavaScript逻辑

// 数据管理模块
const DataManager = {
    // 初始化数据
    init() {
        this.initDefaultData();
        this.updateDashboard();
        this.initAnimations();
        this.loadRecentProjects();
    },
    
    // 初始化默认数据
    initDefaultData() {
        if (!localStorage.getItem('commissionData')) {
            const defaultData = {
                projects: [
                    {
                        id: 'proj_001',
                        projectName: '企业CRM系统升级',
                        customer: '科技有限公司',
                        amount: 450000,
                        dealDate: '2024-10-15',
                        productType: '软件服务',
                        commissionRate: 0.08,
                        status: '已完成',
                        notes: '客户非常满意，有望续签',
                        createdAt: '2024-10-15T10:30:00Z'
                    },
                    {
                        id: 'proj_002', 
                        projectName: '营销自动化平台',
                        customer: '零售连锁集团',
                        amount: 320000,
                        dealDate: '2024-10-10',
                        productType: 'SaaS产品',
                        commissionRate: 0.06,
                        status: '进行中',
                        notes: '正在部署实施',
                        createdAt: '2024-10-10T14:20:00Z'
                    },
                    {
                        id: 'proj_003',
                        projectName: '数据分析解决方案', 
                        customer: '金融服务公司',
                        amount: 280000,
                        dealDate: '2024-10-08',
                        productType: '咨询服务',
                        commissionRate: 0.1,
                        status: '已完成',
                        notes: '项目交付顺利',
                        createdAt: '2024-10-08T09:15:00Z'
                    },
                    {
                        id: 'proj_004',
                        projectName: '移动应用开发',
                        customer: '教育科技公司',
                        amount: 180000,
                        dealDate: '2024-10-05',
                        productType: '开发服务',
                        commissionRate: 0.07,
                        status: '进行中',
                        notes: '开发阶段',
                        createdAt: '2024-10-05T16:45:00Z'
                    },
                    {
                        id: 'proj_005',
                        projectName: '云服务迁移',
                        customer: '制造企业',
                        amount: 220000,
                        dealDate: '2024-10-01',
                        productType: '技术服务',
                        commissionRate: 0.09,
                        status: '已完成',
                        notes: '迁移成功上线',
                        createdAt: '2024-10-01T11:30:00Z'
                    }
                ],
                commissionRules: {
                    ruleName: '2024年销售提成规则',
                    calculationMode: 'ladder',
                    ladderRules: [
                        {min: 0, max: 100000, rate: 0.05},
                        {min: 100000, max: 500000, rate: 0.08},
                        {min: 500000, max: Infinity, rate: 0.12}
                    ]
                },
                annualTarget: 2000000,
                currentAmount: 1250000
            };
            localStorage.setItem('commissionData', JSON.stringify(defaultData));
        }
    },
    
    // 获取数据
    getData() {
        return JSON.parse(localStorage.getItem('commissionData'));
    },
    
    // 保存数据
    saveData(data) {
        localStorage.setItem('commissionData', JSON.stringify(data));
    },
    
    // 添加新项目
    addProject(projectData) {
        const data = this.getData();
        const newProject = {
            id: 'proj_' + Date.now(),
            ...projectData,
            createdAt: new Date().toISOString()
        };
        data.projects.unshift(newProject);
        this.saveData(data);
        this.updateDashboard();
        this.loadRecentProjects();
    },
    
    // 计算本月数据
    calculateMonthlyData() {
        const data = this.getData();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyProjects = data.projects.filter(project => {
            const projectDate = new Date(project.dealDate);
            return projectDate.getMonth() === currentMonth && 
                   projectDate.getFullYear() === currentYear;
        });
        
        const monthlyAmount = monthlyProjects.reduce((sum, project) => sum + project.amount, 0);
        const monthlyCommission = monthlyProjects.reduce((sum, project) => {
            return sum + this.calculateCommission(project.amount, data.commissionRules);
        }, 0);
        
        return {
            amount: monthlyAmount,
            commission: monthlyCommission,
            projectCount: monthlyProjects.length
        };
    },
    
    // 计算提成
    calculateCommission(amount, rules) {
        if (rules.calculationMode === 'ladder') {
            let commission = 0;
            let remaining = amount;
            
            for (const rule of rules.ladderRules) {
                const bracketAmount = Math.min(remaining, rule.max - rule.min);
                if (bracketAmount > 0) {
                    commission += bracketAmount * rule.rate;
                    remaining -= bracketAmount;
                }
            }
            
            return commission;
        }
        return amount * 0.05; // 默认5%
    },
    
    // 更新仪表盘数据
    updateDashboard() {
        const monthlyData = this.calculateMonthlyData();
        
        // 动画更新数字
        this.animateNumber('monthly-amount', 0, monthlyData.amount, 2000, '¥');
        this.animateNumber('monthly-commission', 0, monthlyData.commission, 2000, '¥');
        this.animateNumber('monthly-projects', 0, monthlyData.projectCount, 1500);
        
        // 更新年度目标进度
        const data = this.getData();
        const progressPercent = (data.currentAmount / data.annualTarget * 100).toFixed(1);
        
        // 更新进度环
        const circle = document.querySelector('.progress-ring-circle');
        const circumference = 2 * Math.PI * 50;
        const offset = circumference - (progressPercent / 100) * circumference;
        
        anime({
            targets: circle,
            strokeDashoffset: offset,
            duration: 2000,
            easing: 'easeOutCubic'
        });
    },
    
    // 数字动画
    animateNumber(elementId, start, end, duration, prefix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const obj = { value: start };
        anime({
            targets: obj,
            value: end,
            duration: duration,
            easing: 'easeOutCubic',
            update: function() {
                const value = prefix === '¥' ? 
                    prefix + Math.floor(obj.value).toLocaleString() : 
                    Math.floor(obj.value);
                element.textContent = value;
            }
        });
    },
    
    // 加载最近项目
    loadRecentProjects() {
        const data = this.getData();
        const recentProjects = data.projects.slice(0, 4);
        const container = document.getElementById('recent-projects');
        
        if (!container) return;
        
        container.innerHTML = recentProjects.map(project => `
            <div class="flex items-center justify-between p-3 bg-gray-800 bg-opacity-30 rounded-lg hover:bg-opacity-50 transition-all cursor-pointer">
                <div class="flex-1">
                    <div class="font-medium text-sm">${project.projectName}</div>
                    <div class="text-xs text-gray-400">${project.customer} • ¥${project.amount.toLocaleString()}</div>
                </div>
                <div class="ml-3">
                    <span class="px-2 py-1 text-xs rounded-full ${this.getStatusColor(project.status)}">
                        ${project.status}
                    </span>
                </div>
            </div>
        `).join('');
    },
    
    // 获取状态颜色
    getStatusColor(status) {
        const colors = {
            '已完成': 'bg-green-500 bg-opacity-20 text-green-400',
            '进行中': 'bg-blue-500 bg-opacity-20 text-blue-400',
            '已暂停': 'bg-yellow-500 bg-opacity-20 text-yellow-400',
            '已取消': 'bg-red-500 bg-opacity-20 text-red-400'
        };
        return colors[status] || 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
};

// 视觉效果模块
const VisualEffects = {
    // 初始化动画
    init() {
        this.initPageAnimations();
        this.initParticleBackground();
    },
    
    // 页面动画
    initPageAnimations() {
        // 页面加载动画
        anime.timeline({
            easing: 'easeOutExpo',
            duration: 800
        })
        .add({
            targets: '.glass-card',
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(100)
        })
        .add({
            targets: '.metric-card',
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(50)
        }, '-=400');
        
        // 悬停效果
        document.querySelectorAll('.hover-lift').forEach(card => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    scale: 1.02,
                    duration: 300,
                    easing: 'easeOutCubic'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    scale: 1,
                    duration: 300,
                    easing: 'easeOutCubic'
                });
            });
        });
    },
    
    // 粒子背景
    initParticleBackground() {
        new p5((sketch) => {
            let particles = [];
            const numParticles = 50;
            
            sketch.setup = () => {
                const canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
                canvas.parent('p5-container');
                canvas.id('p5-canvas');
                
                // 初始化粒子
                for (let i = 0; i < numParticles; i++) {
                    particles.push({
                        x: sketch.random(sketch.width),
                        y: sketch.random(sketch.height),
                        vx: sketch.random(-0.5, 0.5),
                        vy: sketch.random(-0.5, 0.5),
                        size: sketch.random(1, 3),
                        opacity: sketch.random(0.1, 0.3)
                    });
                }
            };
            
            sketch.draw = () => {
                sketch.clear();
                
                // 更新和绘制粒子
                particles.forEach(particle => {
                    // 更新位置
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    // 边界检测
                    if (particle.x < 0 || particle.x > sketch.width) particle.vx *= -1;
                    if (particle.y < 0 || particle.y > sketch.height) particle.vy *= -1;
                    
                    // 绘制粒子
                    sketch.fill(0, 212, 255, particle.opacity * 255);
                    sketch.noStroke();
                    sketch.circle(particle.x, particle.y, particle.size);
                });
                
                // 绘制连接线
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dist = sketch.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        if (dist < 100) {
                            const alpha = sketch.map(dist, 0, 100, 0.1, 0);
                            sketch.stroke(0, 212, 255, alpha * 255);
                            sketch.strokeWeight(1);
                            sketch.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        }
                    }
                }
            };
            
            sketch.windowResized = () => {
                sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
            };
        });
    }
};

// UI控制模块
const UIController = {
    // 初始化
    init() {
        this.bindEvents();
    },
    
    // 绑定事件
    bindEvents() {
        // 表单提交
        const form = document.getElementById('add-project-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddProject();
            });
        }
        
        // 模态框外部点击关闭
        const modal = document.getElementById('add-project-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAddProject();
                }
            });
        }
        
        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAddProject();
            }
        });
    },
    
    // 处理添加项目
    handleAddProject() {
        const formData = {
            projectName: document.getElementById('project-name').value,
            customer: document.getElementById('customer-name').value,
            amount: parseFloat(document.getElementById('project-amount').value),
            dealDate: document.getElementById('deal-date').value,
            productType: '标准产品',
            commissionRate: 0.06,
            status: '进行中',
            notes: ''
        };
        
        DataManager.addProject(formData);
        this.closeAddProject();
        this.showNotification('项目添加成功！', 'success');
    },
    
    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    },
    
    // 关闭添加项目模态框
    closeAddProject() {
        const modal = document.getElementById('add-project-modal');
        const content = document.getElementById('modal-content');
        
        if (modal && content) {
            // 动画隐藏
            anime({
                targets: content,
                scale: 0.95,
                opacity: 0,
                duration: 200,
                easing: 'easeOutCubic',
                complete: () => {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }
            });
            
            // 重置表单
            const form = document.getElementById('add-project-form');
            if (form) form.reset();
        }
    }
};

// 全局函数
function openAddProject() {
    const modal = document.getElementById('add-project-modal');
    const content = document.getElementById('modal-content');
    
    if (modal && content) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // 动画显示
        anime({
            targets: content,
            scale: [0.95, 1],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutCubic'
        });
    }
}

function closeAddProject() {
    UIController.closeAddProject();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    DataManager.init();
    VisualEffects.init();
    UIController.init();
});

// 导出模块供其他页面使用
window.CommissionApp = {
    DataManager,
    VisualEffects,
    UIController
};
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Network, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Key, 
  ChevronRight, 
  ChevronDown,
  Building,
  CheckCircle,
  XCircle,
  ClipboardList,
  BookOpenCheck,
  Save,
  FileText,
  Calendar,
  Download,
  X
} from 'lucide-react';
import { Role } from '../types';

// --- Types ---
interface SystemUser {
  id: string;
  name: string;
  username: string;
  roles: Role[];
  org: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

interface OrgNode {
  id: string;
  label: string;
  type: 'group' | 'school' | 'grade' | 'class' | 'dept';
  children?: OrgNode[];
}

interface PermissionModule {
  name: string;
  actions: { id: string; label: string; enabled: boolean }[];
}

interface MoralIndicator {
  id: string;
  majorCategory: string; // 大项
  minorCategory: string; // 小项
  name: string;          // 指标名称
  type: 'bonus' | 'deduction'; // 类型
  score: number;         // 分值
  enabled: boolean;      // 状态
}

interface TeachingIndicator {
  id: string;
  majorCategory: string; // 大项
  name: string;          // 指标名称
  type: 'score' | 'bonus' | 'deduction'; // 类型: 评分项 | 加分项 | 扣分项
  score: number;         // 分值
  enabled: boolean;      // 状态
}

interface SystemLog {
  id: string;
  user: string;
  role: string;
  action: string; // e.g., "Login", "Update", "Delete"
  module: string;
  description: string;
  ip: string;
  time: string;
  status: 'success' | 'failure';
}

// --- Mock Data ---
const MOCK_USERS: SystemUser[] = [
  { id: '1', name: '张主任', username: 'zhangzr', roles: [Role.ADMIN], org: '教务处', status: 'active', lastLogin: '2025-11-10 09:30' },
  { id: '2', name: '王校长', username: 'wangxz', roles: [Role.PRINCIPAL], org: '校长室', status: 'active', lastLogin: '2025-11-09 14:20' },
  { id: '3', name: '陈老师', username: 'chenls', roles: [Role.TEACHER], org: '高一数学组', status: 'active', lastLogin: '2025-11-10 08:15' },
  { id: '4', name: '李明', username: 's001', roles: [Role.STUDENT], org: '高一(1)班', status: 'inactive', lastLogin: '2025-11-01 10:00' },
];

const MOCK_ORG_TREE: OrgNode[] = [
  {
    id: 'g1',
    label: '水手教育集团',
    type: 'group',
    children: [
      {
        id: 's1',
        label: '第一实验中学',
        type: 'school',
        children: [
          {
            id: 'd1',
            label: '行政部门',
            type: 'dept',
            children: [
              { id: 'd1-1', label: '校长室', type: 'dept' },
              { id: 'd1-2', label: '教务处', type: 'dept' },
            ]
          },
          {
            id: 'gr1',
            label: '高一年级',
            type: 'grade',
            children: [
              { id: 'c1-1', label: '1班', type: 'class' },
              { id: 'c1-2', label: '2班', type: 'class' },
              { id: 'c1-3', label: '3班', type: 'class' },
            ]
          },
          {
            id: 'gr2',
            label: '高二年级',
            type: 'grade',
            children: [
                { id: 'c2-1', label: '1班', type: 'class' },
                { id: 'c2-2', label: '2班', type: 'class' },
            ]
          }
        ]
      }
    ]
  }
];

const MOCK_PERMISSIONS: PermissionModule[] = [
    { name: '首页概览', actions: [{ id: 'p1', label: '查看报表', enabled: true }, { id: 'p2', label: '导出数据', enabled: true }] },
    { name: '学生管理', actions: [{ id: 'p3', label: '查看列表', enabled: true }, { id: 'p4', label: '编辑档案', enabled: true }, { id: 'p5', label: '删除学生', enabled: false }] },
    { name: '教师管理', actions: [{ id: 'p6', label: '查看列表', enabled: true }, { id: 'p7', label: '教学评价', enabled: false }] },
    { name: '系统设置', actions: [{ id: 'p8', label: '用户管理', enabled: false }, { id: 'p9', label: '角色分配', enabled: false }] },
];

const MOCK_MORAL_INDICATORS: MoralIndicator[] = [
  { id: 'm1', majorCategory: '德育常规', minorCategory: '考勤纪律', name: '上课迟到', type: 'deduction', score: 2, enabled: true },
  { id: 'm2', majorCategory: '德育常规', minorCategory: '考勤纪律', name: '无故旷课', type: 'deduction', score: 5, enabled: true },
  { id: 'm3', majorCategory: '德育常规', minorCategory: '仪容仪表', name: '未穿校服', type: 'deduction', score: 2, enabled: true },
  { id: 'm4', majorCategory: '卫生管理', minorCategory: '教室卫生', name: '地面有垃圾', type: 'deduction', score: 1, enabled: true },
  { id: 'm5', majorCategory: '荣誉表彰', minorCategory: '品德风尚', name: '拾金不昧', type: 'bonus', score: 5, enabled: true },
  { id: 'm6', majorCategory: '荣誉表彰', minorCategory: '竞赛获奖', name: '校级比赛一等奖', type: 'bonus', score: 10, enabled: true },
  { id: 'm7', majorCategory: '宿舍管理', minorCategory: '内务整理', name: '被褥叠放不整齐', type: 'deduction', score: 3, enabled: false },
];

const MOCK_TEACHING_INDICATORS: TeachingIndicator[] = [
  { id: 't1', majorCategory: '学生评教', name: '教学态度', type: 'score', score: 20, enabled: true },
  { id: 't2', majorCategory: '学生评教', name: '课堂互动', type: 'score', score: 20, enabled: true },
  { id: 't3', majorCategory: '同行互评', name: '教学设计', type: 'score', score: 15, enabled: true },
  { id: 't4', majorCategory: '同行互评', name: '教学创新', type: 'score', score: 15, enabled: true },
  { id: 't5', majorCategory: '行政考评', name: '工作纪律', type: 'score', score: 30, enabled: true },
  { id: 't6', majorCategory: '行政考评', name: '教学事故', type: 'deduction', score: 10, enabled: true },
  { id: 't7', majorCategory: '行政考评', name: '公开课获奖', type: 'bonus', score: 5, enabled: true },
];

const MOCK_LOGS: SystemLog[] = [
    { id: 'L001', user: '张主任', role: '管理员', action: '登录', module: '系统入口', description: '用户登录成功', ip: '192.168.1.101', time: '2025-11-10 09:30:05', status: 'success' },
    { id: 'L002', user: '张主任', role: '管理员', action: '新增用户', module: '用户管理', description: '创建新教师账号: t_wang', ip: '192.168.1.101', time: '2025-11-10 09:35:12', status: 'success' },
    { id: 'L003', user: '王校长', role: '校长', action: '导出报表', module: '德育管理', description: '导出全校德育月报', ip: '192.168.1.105', time: '2025-11-10 10:15:00', status: 'success' },
    { id: 'L004', user: '陈老师', role: '教师', action: '录入数据', module: '数据采集', description: '录入305宿舍违纪', ip: '192.168.1.120', time: '2025-11-10 11:20:45', status: 'success' },
    { id: 'L005', user: 'unknown', role: '-', action: '登录', module: '系统入口', description: '密码错误尝试 (admin)', ip: '202.106.0.1', time: '2025-11-10 12:00:01', status: 'failure' },
    { id: 'L006', user: '张主任', role: '管理员', action: '修改指标', module: '系统设置', description: '修改“上课迟到”扣分值: 1 -> 2', ip: '192.168.1.101', time: '2025-11-10 14:05:33', status: 'success' },
];

// --- Sub-components ---

const UserManagementTab = () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="搜索姓名、账号或部门..." 
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex space-x-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none items-center justify-center inline-flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <Plus className="h-4 w-4 mr-2" />
                        新增用户
                    </button>
                    <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                        批量导入
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">用户信息</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">角色</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">归属部门/班级</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">最近登录</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {MOCK_USERS.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                            {user.name[0]}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                            <div className="text-xs text-slate-500">@{user.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-wrap gap-1">
                                        {user.roles.map(r => (
                                            <span key={r} className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                {r}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {user.org}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                                    }`}>
                                        {user.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                        {user.status === 'active' ? '启用' : '禁用'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {user.lastLogin}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="重置密码">
                                            <Key size={16} />
                                        </button>
                                        <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="编辑">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-1 text-slate-400 hover:text-red-600 transition-colors" title="删除">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-500">显示 1 至 4 共 4 条记录</span>
                    <div className="flex space-x-1">
                        <button className="px-2 py-1 border border-slate-300 rounded bg-white text-xs disabled:opacity-50" disabled>上一页</button>
                        <button className="px-2 py-1 border border-slate-300 rounded bg-white text-xs disabled:opacity-50" disabled>下一页</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RoleManagementTab = () => {
    const [selectedRole, setSelectedRole] = useState<Role>(Role.ADMIN);

    return (
        <div className="flex flex-col lg:flex-row h-[600px] gap-6">
            {/* Roles List */}
            <div className="w-full lg:w-1/4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-800">角色列表</h3>
                    <button className="p-1 hover:bg-slate-200 rounded transition-colors"><Plus size={16} className="text-blue-600" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {Object.values(Role).map((role) => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                                selectedRole === role 
                                    ? 'bg-blue-50 text-blue-700' 
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <span className="flex items-center">
                                <Shield className="w-4 h-4 mr-2 opacity-70" />
                                {role}
                            </span>
                            {selectedRole === role && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Permissions Matrix */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                 <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-800">
                        权限配置 - <span className="text-blue-600">{selectedRole}</span>
                    </h3>
                    <button className="px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                        <Save className="w-3 h-3 mr-1.5" />
                        保存配置
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-8">
                        {MOCK_PERMISSIONS.map((module) => (
                            <div key={module.name}>
                                <h4 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
                                    {module.name}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {module.actions.map((action) => (
                                        <label key={action.id} className="flex items-center space-x-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer group">
                                            <input 
                                                type="checkbox" 
                                                defaultChecked={action.enabled}
                                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-slate-600 group-hover:text-slate-900">{action.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Recursive Tree Node Component
const TreeNode: React.FC<{ node: OrgNode, level?: number, expandTrigger?: number }> = ({ node, level = 0, expandTrigger = 0 }) => {
    const [isOpen, setIsOpen] = useState(true);
    const paddingLeft = level * 20 + 12;

    // Listen to expandTrigger changes to force open
    useEffect(() => {
        if (expandTrigger > 0) {
            setIsOpen(true);
        }
    }, [expandTrigger]);

    return (
        <div className="select-none">
            <div 
                className="flex items-center py-2 px-3 hover:bg-slate-50 border-b border-slate-50 group transition-colors"
                style={{ paddingLeft: `${paddingLeft}px` }}
            >
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-1 mr-2 rounded hover:bg-slate-200 text-slate-400 ${!node.children ? 'invisible' : ''}`}
                >
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                
                <div className={`mr-2 p-1.5 rounded-lg ${
                    node.type === 'group' ? 'bg-indigo-100 text-indigo-600' :
                    node.type === 'school' ? 'bg-blue-100 text-blue-600' :
                    node.type === 'grade' ? 'bg-green-100 text-green-600' :
                    node.type === 'class' ? 'bg-orange-100 text-orange-600' :
                    'bg-slate-100 text-slate-600'
                }`}>
                    <Building size={14} />
                </div>

                <span className="text-sm font-medium text-slate-700">{node.label}</span>
                <span className="ml-3 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 uppercase">
                    {node.type}
                </span>

                <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center space-x-2">
                     <button className="p-1 text-slate-400 hover:text-blue-600" title="添加子节点">
                        <Plus size={14} />
                     </button>
                     <button className="p-1 text-slate-400 hover:text-blue-600" title="编辑">
                        <Edit2 size={14} />
                     </button>
                     <button className="p-1 text-slate-400 hover:text-red-600" title="删除">
                        <Trash2 size={14} />
                     </button>
                </div>
            </div>
            {isOpen && node.children && (
                <div className="border-l border-slate-100 ml-[26px]">
                    {node.children.map(child => (
                        <TreeNode key={child.id} node={child} level={level + 1} expandTrigger={expandTrigger} />
                    ))}
                </div>
            )}
        </div>
    );
};

const OrgManagementTab = () => {
    const [treeData, setTreeData] = useState<OrgNode[]>(MOCK_ORG_TREE);
    const [expandTrigger, setExpandTrigger] = useState(0); // Used to signal expand all
    const [isRootModalOpen, setIsRootModalOpen] = useState(false);
    
    // Form state for adding root node
    const [newRootName, setNewRootName] = useState('');
    const [newRootType, setNewRootType] = useState('group');

    const handleExpandAll = () => {
        setExpandTrigger(prev => prev + 1);
    };

    const handleAddRootNode = () => {
        if (!newRootName.trim()) return;

        const newNode: OrgNode = {
            id: `root-${Date.now()}`,
            label: newRootName,
            type: newRootType as any,
            children: []
        };
        
        setTreeData([...treeData, newNode]);
        setIsRootModalOpen(false);
        setNewRootName('');
        setNewRootType('group');
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col relative">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h3 className="font-semibold text-slate-800">组织机构树</h3>
                 <div className="flex space-x-2">
                    <button 
                        onClick={handleExpandAll}
                        className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-md hover:bg-slate-50 text-slate-700"
                    >
                        全部展开
                    </button>
                    <button 
                        onClick={() => setIsRootModalOpen(true)}
                        className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        + 新增根节点
                    </button>
                 </div>
            </div>
            <div className="p-2 overflow-auto flex-1">
                {treeData.map(node => (
                    <TreeNode key={node.id} node={node} expandTrigger={expandTrigger} />
                ))}
            </div>

            {/* Add Root Node Modal */}
            {isRootModalOpen && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30 rounded-xl">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden animate-fade-in-up">
                        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 bg-slate-50">
                            <h3 className="text-sm font-bold text-slate-800">新增根节点</h3>
                            <button onClick={() => setIsRootModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">节点名称</label>
                                <input 
                                    type="text" 
                                    className="block w-full rounded border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="请输入名称"
                                    value={newRootName}
                                    onChange={(e) => setNewRootName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">节点类型</label>
                                <select 
                                    className="block w-full rounded border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={newRootType}
                                    onChange={(e) => setNewRootType(e.target.value)}
                                >
                                    <option value="group">集团 (Group)</option>
                                    <option value="school">学校 (School)</option>
                                    <option value="dept">部门 (Dept)</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
                            <button 
                                onClick={() => setIsRootModalOpen(false)}
                                className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-white"
                            >
                                取消
                            </button>
                            <button 
                                onClick={handleAddRootNode}
                                className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                            >
                                确定
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MoralIndicatorsTab = () => {
    const [indicators, setIndicators] = useState<MoralIndicator[]>(MOCK_MORAL_INDICATORS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<MoralIndicator>>({
        majorCategory: '',
        minorCategory: '',
        name: '',
        type: 'deduction',
        score: 0,
        enabled: true
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const totalPages = Math.ceil(indicators.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = indicators.slice(startIndex, startIndex + itemsPerPage);

    const handleOpenModal = () => {
        setFormData({
            majorCategory: '',
            minorCategory: '',
            name: '',
            type: 'deduction',
            score: 0,
            enabled: true
        });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        const newIndicator: MoralIndicator = {
            id: Date.now().toString(),
            majorCategory: formData.majorCategory || '未分类',
            minorCategory: formData.minorCategory || '未分类',
            name: formData.name || '新指标',
            type: formData.type as 'bonus' | 'deduction',
            score: Number(formData.score) || 0,
            enabled: formData.enabled || false
        };
        setIndicators([...indicators, newIndicator]);
        setIsModalOpen(false);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="space-y-4">
             <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-wrap space-x-4">
                     <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="搜索指标名称..." 
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="">所有大项</option>
                        <option value="routine">德育常规</option>
                        <option value="hygiene">卫生管理</option>
                        <option value="dorm">宿舍管理</option>
                        <option value="honor">荣誉表彰</option>
                    </select>
                </div>
                <button 
                    onClick={handleOpenModal}
                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    新增德育指标
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">大项</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">小项</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">指标名称</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">类型</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">分值</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {currentItems.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                                    {item.majorCategory}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {item.minorCategory}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                    {item.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                        item.type === 'bonus' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {item.type === 'bonus' ? '加分项' : '扣分项'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">
                                    {item.type === 'deduction' ? '-' : '+'}{item.score}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input 
                                            type="checkbox" 
                                            name="toggle" 
                                            id={`toggle-${item.id}`} 
                                            checked={item.enabled} 
                                            readOnly
                                            className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-blue-600"
                                        />
                                        <label 
                                            htmlFor={`toggle-${item.id}`} 
                                            className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${item.enabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                                        ></label>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 mr-3" title="编辑"><Edit2 size={16}/></button>
                                    <button className="text-red-600 hover:text-red-900" title="删除"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Pagination Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600">
                    <span>共 {indicators.length} 条</span>
                    <select 
                        className="border-slate-300 rounded text-sm py-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={10}>10条/页</option>
                        <option value={20}>20条/页</option>
                        <option value={50}>50条/页</option>
                    </select>
                    
                    <button 
                        className="px-2 py-1 text-slate-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                         <button 
                            key={page}
                            className={`px-3 py-1 rounded transition-colors ${
                                currentPage === page 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-slate-600 hover:bg-slate-200'
                            }`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button 
                        className="px-2 py-1 text-slate-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                    
                    <span>前往</span>
                    <input 
                        type="number" 
                        min="1" 
                        max={totalPages}
                        className="w-12 border border-slate-300 rounded text-center py-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        onKeyDown={(e) => {
                             if(e.key === 'Enter') {
                                 const val = parseInt((e.target as HTMLInputElement).value);
                                 if (!isNaN(val) && val >= 1 && val <= totalPages) setCurrentPage(val);
                             }
                        }}
                    />
                    <span>页</span>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-fade-in-up">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">新增德育指标</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">大项 (Major)</label>
                                    <input 
                                        type="text" 
                                        className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="例如：德育常规"
                                        value={formData.majorCategory}
                                        onChange={(e) => setFormData({...formData, majorCategory: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">小项 (Minor)</label>
                                    <input 
                                        type="text" 
                                        className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="例如：考勤纪律"
                                        value={formData.minorCategory}
                                        onChange={(e) => setFormData({...formData, minorCategory: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">指标名称 (Indicator Name)</label>
                                <input 
                                    type="text" 
                                    className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="例如：上课迟到"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">类型 (Type)</label>
                                    <select 
                                        className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                                    >
                                        <option value="deduction">扣分项</option>
                                        <option value="bonus">加分项</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">分值 (Score)</label>
                                    <input 
                                        type="number" 
                                        className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.score}
                                        onChange={(e) => setFormData({...formData, score: parseInt(e.target.value)})}
                                    />
                                </div>
                            </div>
                             <div className="flex items-center">
                                <input 
                                    id="moral-enabled-check"
                                    type="checkbox" 
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                    checked={formData.enabled}
                                    onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
                                />
                                <label htmlFor="moral-enabled-check" className="ml-2 block text-sm text-slate-900">
                                    启用该指标
                                </label>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white"
                            >
                                取消
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                            >
                                确定新增
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TeachingIndicatorsTab = () => {
    const [indicators, setIndicators] = useState<TeachingIndicator[]>(MOCK_TEACHING_INDICATORS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<TeachingIndicator>>({
        majorCategory: '',
        name: '',
        type: 'score',
        score: 10,
        enabled: true
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const totalPages = Math.ceil(indicators.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = indicators.slice(startIndex, startIndex + itemsPerPage);

    const handleOpenModal = () => {
        setFormData({
            majorCategory: '',
            name: '',
            type: 'score',
            score: 10,
            enabled: true
        });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        const newIndicator: TeachingIndicator = {
            id: Date.now().toString(),
            majorCategory: formData.majorCategory || '未分类',
            name: formData.name || '新指标',
            type: formData.type as any || 'score',
            score: Number(formData.score) || 0,
            enabled: formData.enabled || false
        };
        setIndicators([...indicators, newIndicator]);
        setIsModalOpen(false);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
         <div className="space-y-4">
             <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                     <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="搜索指标名称..." 
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                     <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="">所有大项</option>
                        <option value="student">学生评教</option>
                        <option value="peer">同行互评</option>
                        <option value="admin">行政考评</option>
                    </select>
                </div>
                <button 
                    onClick={handleOpenModal}
                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    新增评价指标
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">大项</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">指标名称</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">类型</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">分值</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {currentItems.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                                    {item.majorCategory}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                    {item.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                        item.type === 'bonus' ? 'bg-green-100 text-green-700' : 
                                        item.type === 'deduction' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {item.type === 'bonus' ? '加分项' : item.type === 'deduction' ? '扣分项' : '评分项'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">
                                    {item.score}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input 
                                            type="checkbox" 
                                            checked={item.enabled} 
                                            readOnly
                                            className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-blue-600"
                                        />
                                        <label className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${item.enabled ? 'bg-blue-600' : 'bg-slate-300'}`}></label>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 mr-3"><Edit2 size={16}/></button>
                                    <button className="text-red-600 hover:text-red-900"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Pagination Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600">
                    <span>共 {indicators.length} 条</span>
                    <select 
                        className="border-slate-300 rounded text-sm py-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={10}>10条/页</option>
                        <option value={20}>20条/页</option>
                        <option value={50}>50条/页</option>
                    </select>
                    
                    <button 
                        className="px-2 py-1 text-slate-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                         <button 
                            key={page}
                            className={`px-3 py-1 rounded transition-colors ${
                                currentPage === page 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-slate-600 hover:bg-slate-200'
                            }`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button 
                        className="px-2 py-1 text-slate-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                    
                    <span>前往</span>
                    <input 
                        type="number" 
                        min="1" 
                        max={totalPages}
                        className="w-12 border border-slate-300 rounded text-center py-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        onKeyDown={(e) => {
                             if(e.key === 'Enter') {
                                 const val = parseInt((e.target as HTMLInputElement).value);
                                 if (!isNaN(val) && val >= 1 && val <= totalPages) setCurrentPage(val);
                             }
                        }}
                    />
                    <span>页</span>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-fade-in-up">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">新增评价指标</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">大项 (Major Category)</label>
                                <input 
                                    type="text" 
                                    className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="例如：学生评教"
                                    value={formData.majorCategory}
                                    onChange={(e) => setFormData({...formData, majorCategory: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">指标名称 (Indicator Name)</label>
                                <input 
                                    type="text" 
                                    className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="例如：课堂互动"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">类型 (Type)</label>
                                    <select 
                                        className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                                    >
                                        <option value="score">评分项</option>
                                        <option value="bonus">加分项</option>
                                        <option value="deduction">扣分项</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">分值 (Score)</label>
                                    <input 
                                        type="number" 
                                        className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.score}
                                        onChange={(e) => setFormData({...formData, score: parseInt(e.target.value)})}
                                    />
                                </div>
                            </div>
                             <div className="flex items-center">
                                <input 
                                    id="enabled-check"
                                    type="checkbox" 
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                    checked={formData.enabled}
                                    onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
                                />
                                <label htmlFor="enabled-check" className="ml-2 block text-sm text-slate-900">
                                    启用该指标
                                </label>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white"
                            >
                                取消
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                            >
                                确定新增
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <BookOpenCheck className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">总分校验</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>当前各项指标满分总和为: <span className="font-bold">100分</span> (学生评教 40 + 同行互评 30 + 行政考评 30)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SystemLogsTab = () => {
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="flex flex-1 space-x-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="搜索用户、动作或IP..." 
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-slate-400" />
                        </div>
                        <input type="date" className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                    </div>
                </div>
                <div>
                     <button className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                        <Download className="mr-2 h-4 w-4" />
                        导出日志
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">操作人</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">动作类型</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">操作模块</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">操作描述</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">IP地址</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">操作时间</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {MOCK_LOGS.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-900">{log.user}</div>
                                    <div className="text-xs text-slate-500">{log.role}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {log.module}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={log.description}>
                                    {log.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                                    {log.ip}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {log.time}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {log.status === 'success' ? (
                                        <span className="inline-flex items-center text-xs font-medium text-green-700">
                                            <CheckCircle className="w-3 h-3 mr-1" /> 成功
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center text-xs font-medium text-red-700">
                                            <XCircle className="w-3 h-3 mr-1" /> 失败
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-500">显示 1 至 6 共 6 条记录</span>
                    <div className="flex space-x-1">
                        <button className="px-2 py-1 border border-slate-300 rounded bg-white text-xs disabled:opacity-50" disabled>上一页</button>
                        <button className="px-2 py-1 border border-slate-300 rounded bg-white text-xs disabled:opacity-50" disabled>下一页</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- Main Component ---
const SystemManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'org' | 'moral_indicators' | 'teaching_indicators' | 'logs'>('users');

  const tabs = [
    { id: 'users', label: '用户管理', icon: Users },
    { id: 'roles', label: '角色权限', icon: Shield },
    { id: 'org', label: '组织机构', icon: Network },
    { id: 'moral_indicators', label: '德育评价管理', icon: ClipboardList },
    { id: 'teaching_indicators', label: '教学评价管理', icon: BookOpenCheck },
    { id: 'logs', label: '日志审计', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">系统管理 (System Settings)</h1>
          <p className="text-slate-500 mt-1">管理用户账号、系统角色权限及组织架构。</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit min-w-max">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                            activeTab === tab.id
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                        <Icon className="w-4 h-4 mr-2" />
                        {tab.label}
                    </button>
                );
            })}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === 'users' && <UserManagementTab />}
        {activeTab === 'roles' && <RoleManagementTab />}
        {activeTab === 'org' && <OrgManagementTab />}
        {activeTab === 'moral_indicators' && <MoralIndicatorsTab />}
        {activeTab === 'teaching_indicators' && <TeachingIndicatorsTab />}
        {activeTab === 'logs' && <SystemLogsTab />}
      </div>
    </div>
  );
};

export default SystemManagement;
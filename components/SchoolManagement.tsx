import React, { useState, useRef } from 'react';
import { Upload, Download, Search, Plus, X, ChevronDown } from 'lucide-react';
import { Student } from '../types';

// --- Types & Interfaces ---

interface School {
  id: string;
  name: string;
  type: string;
  address: string;
  principal: string;
  contact: string;
  studentCount: number;
  teacherCount: number;
  stages: string;
  gradeCount: number;
  classCount: number;
}

interface ClassInfo {
  id: string;
  name: string;
  grade: string;
  stage: string;
  school: string;
  headTeacher: string;
  teachers: {
    chinese?: string;
    math?: string;
    english?: string;
    physics?: string;
    chemistry?: string;
    biology?: string;
    geography?: string;
    politics?: string;
    history?: string;
    morality?: string;
    it?: string;
    pe?: string;
    music?: string;
    [key: string]: string | undefined;
  };
  seatingGroups?: { id: number; name: string; students: string[] }[];
  allStudents?: string[];
}

interface Teacher {
  id: string;
  name: string;
  gender: '男' | '女';
  school: string;
  grades: string; // Can be multiple lines or comma separated
  positions: string; // e.g. "班主任, 任课教师"
  subject: string;
  phone: string;
}

// --- Mock Data ---

const SCHOOLS: School[] = [
  {
    id: '1',
    name: '长水实验中学杨凌校区',
    type: '民办',
    address: '陕西省咸阳市杨陵区兴教路与渭惠路交叉口西南260米',
    principal: '韩利永',
    contact: '',
    studentCount: 2179,
    teacherCount: 149,
    stages: '初中,高中',
    gradeCount: 6,
    classCount: 42
  },
  {
    id: '2',
    name: '长水实验中学呈贡校区',
    type: '',
    address: '',
    principal: '',
    contact: '',
    studentCount: 0,
    teacherCount: 0,
    stages: '',
    gradeCount: 0,
    classCount: 0
  },
  {
    id: '3',
    name: '长水实验中学滇池校区',
    type: '',
    address: '',
    principal: '',
    contact: '',
    studentCount: 0,
    teacherCount: 0,
    stages: '',
    gradeCount: 0,
    classCount: 0
  }
];

const STUDENTS: Student[] = [
  {
    id: '2023001',
    name: '张三',
    gender: '男',
    school: '长水实验中学杨凌校区',
    grade: '初一',
    class: '37班',
    building: '男生宿舍楼',
    floor: 3,
    dorm: '305',
    bedNo: 1,
    createTime: '2023-09-01',
    score: 95
  },
  {
    id: '2023002',
    name: '李四',
    gender: '女',
    school: '长水实验中学杨凌校区',
    grade: '初一',
    class: '38班',
    building: '女生宿舍楼',
    floor: 2,
    dorm: '201',
    bedNo: 2,
    createTime: '2023-09-01',
    score: 98
  },
   {
    id: '2023003',
    name: '王五',
    gender: '男',
    school: '长水实验中学杨凌校区',
    grade: '高一',
    class: '1班',
    building: '男生宿舍楼',
    floor: 4,
    dorm: '402',
    bedNo: 3,
    createTime: '2023-09-01',
    score: 88
  },
];

const MOCK_CLASSES: ClassInfo[] = [
  {
    id: '1',
    name: '37班',
    grade: '初一',
    stage: '初中',
    school: '长水实验中学杨凌校区',
    headTeacher: '李思源',
    teachers: {
      chinese: '翟佳晴',
      math: '李思源',
      english: '韩林轩',
      biology: '杨子珊',
      geography: '赵鹏',
      history: '康晨阳',
      morality: '雷倩',
    },
    allStudents: ['高志城', '杜雨萱', '李思源', '赵怡晴', '曹梓轩', '李俐萦', '胡昕阳', '马瑜想', '朱泊宸', '梁怡帆', '马子懿', '彭流琪', '彭奕凡', '杜金瑶', '乔思琪', '彭恋媛', '徐一鸣', '胡宇航', '刘怡轩', '郑紫嫣', '陈浩天', '殷羽泽', '朱斯汗', '徐百叶', '王思涵', '闫昊宸', '李宇鑫', '李怡杰', '王艾静', '李伯依', '白思航', '胡羽辰', '刘昱涵', '张思雨', '蒋祝晨', '刘依诺', '郭奕豪', '康天宇', '王岳琪', '周锦凡', '何卓俊', '刘依涵'],
    seatingGroups: [
        { id: 1, name: '第1组', students: ['胡柄辰', '郭奕豪', '康天宇', '柴文凯', '杜雨萱', '李佩颖'] },
        { id: 2, name: '第2组', students: ['刘昱涵', '刘浮涵', '王岳琪', '刘依涵雪', '李嘉璇', '曹梓轩'] },
        { id: 3, name: '第3组', students: ['张思雨', '蒋祝晨', '周锦凡', '何卓俊', '赵怡晴', '胡昕阳'] },
        { id: 4, name: '第4组', students: ['朱明轩', '徐百叶', '杨欣蕾', '杨伟泽', '乔思琪', '胡宇航', '商嘉诚'] },
        { id: 5, name: '第5组', students: ['路雅淇', '闫昊宸', '申哲宇', '张湄皎', '徐一鸣', '彭流琪', '马瑜想'] },
        { id: 6, name: '第6组', students: ['殷羽泽', '王思涵', '徐靖歘', '陈浩天', '彭嘉媛', '郑紫嫣'] },
        { id: 7, name: '第7组', students: ['李怡杰', '白思航', '龚雨欣', '党钰林', '朱语宸', '杜金瑶'] },
        { id: 8, name: '第8组', students: ['李宇鑫', '李伯依', '杨紫萱', '师东宥', '梁怡帆', '彭奕凡'] },
        { id: 9, name: '第9组', students: ['王思皓', '王艾静', '何启桦', '张云迪', '马子懿', '彭嘉琪'] },
    ]
  },
  {
    id: '2',
    name: '38班',
    grade: '初一',
    stage: '初中',
    school: '长水实验中学杨凌校区',
    headTeacher: '王江',
    teachers: {
      chinese: '白少桐',
      math: '林姿娜',
      english: '蔡国丽',
      biology: '陈鑫',
      geography: '许凡',
      history: '李帅',
    },
    seatingGroups: []
  },
  {
    id: '3',
    name: '39班',
    grade: '初一',
    stage: '初中',
    school: '长水实验中学杨凌校区',
    headTeacher: '龙籽蓉',
    teachers: {
      chinese: '陈怡帆',
      math: '杨艳汇',
      english: '龙籽蓉',
      biology: '吕宁',
      geography: '赵鹏',
      history: '勾欣颖',
      morality: '李艳霞',
    },
    seatingGroups: []
  },
  {
    id: '4',
    name: '40班',
    grade: '初一',
    stage: '初中',
    school: '长水实验中学杨凌校区',
    headTeacher: '陈鑫',
    teachers: {
       chinese: '白少桐',
       math: '林姿娜',
       english: '蔡国丽',
       biology: '陈鑫',
       geography: '牛锦荣',
       history: '康晨阳',
       morality: '雷倩',
    },
    seatingGroups: []
  },
   {
    id: '5',
    name: '41班',
    grade: '初一',
    stage: '初中',
    school: '长水实验中学杨凌校区',
    headTeacher: '韩林轩',
    teachers: {
       chinese: '陈怡帆',
       math: '李思源',
       english: '韩林轩',
       biology: '吕宁',
       geography: '许凡',
       history: '李帅',
       morality: '李艳霞',
    },
    seatingGroups: []
  },
   {
    id: '6',
    name: '42班',
    grade: '初一',
    stage: '初中',
    school: '长水实验中学杨凌校区',
    headTeacher: '陈安平',
    teachers: {
       chinese: '翟佳晴',
       math: '杨艳汇',
       english: '龙籽蓉',
       biology: '张钰析',
       geography: '牛锦荣',
       history: '勾欣颖',
    },
    seatingGroups: []
  },
   {
    id: '7',
    name: '27班',
    grade: '初二',
    stage: '初中',
    school: '长水实验中学杨凌校区',
    headTeacher: '贾亚花',
    teachers: {
       chinese: '沈彩宏',
       math: '闫凡烨',
       english: '贾亚花',
       physics: '杨建兵',
       chemistry: '郭艺佳',
       biology: '杨子珊',
       geography: '许凡',
       history: '康晨阳',
       morality: '李艳霞',
    },
    seatingGroups: []
  },
   {
    id: '8',
    name: '28班',
    grade: '初二',
    stage: '初中',
    school: '长水实验中学杨凌校区',
    headTeacher: '王佳豪',
    teachers: {
       chinese: '张倩',
       math: '王佳豪',
       english: '刘丽君',
       physics: '晃城龙',
       chemistry: '郭艺佳',
       biology: '杨子珊',
       geography: '牛锦荣',
       history: '李帅',
    },
    seatingGroups: []
  },
  {
    id: '9',
    name: '29班',
    grade: '初二',
    stage: '初中',
    school: '长水实验中学杨凌校区',
    headTeacher: '张艺欣',
    teachers: {
       chinese: '刘鹏举',
       math: '孙少鑫',
       english: '张艺欣',
       physics: '杨建兵',
       chemistry: '郭艺佳',
       biology: '张钰析',
       geography: '许凡',
       history: '勾欣颖',
       morality: '李艳霞',
    },
    seatingGroups: []
  },
  {
    id: '10',
    name: '30班',
    grade: '初二',
    stage: '初中',
    school: '长水实验中学杨凌校区',
    headTeacher: '',
    teachers: {
       chinese: '刘美萱',
       math: '王佳豪',
       english: '赵香香',
       physics: '毕明月',
       chemistry: '郭艺佳',
       biology: '吕宁',
       geography: '赵鹏',
       history: '康晨阳',
       morality: '李艳霞',
    },
    seatingGroups: []
  },
];

const MOCK_TEACHERS: Teacher[] = [
    { id: '1', name: '郭圆圆', gender: '女', school: '长水实验中学杨凌校区', grades: '高二', positions: '班主任, 任课教师', subject: '语文', phone: '13820819181' },
    { id: '2', name: '杨洁', gender: '男', school: '长水实验中学杨凌校区', grades: '高二', positions: '班主任, 任课教师', subject: '语文', phone: '18690622775' },
    { id: '3', name: '罗永萍', gender: '女', school: '长水实验中学杨凌校区', grades: '初一, 初二, 初三,\n高一, 高二, 高三', positions: '职工', subject: '', phone: '18220048685' },
    { id: '4', name: '张依然', gender: '女', school: '长水实验中学杨凌校区', grades: '初一, 初二, 初三,\n高一, 高二, 高三', positions: '任课教师', subject: '', phone: '18091508830' },
    { id: '5', name: '牛聪敏', gender: '女', school: '长水实验中学杨凌校区', grades: '初一, 初二, 初三,\n高一, 高二, 高三', positions: '', subject: '', phone: '15381614270' },
    { id: '6', name: '李思源', gender: '男', school: '长水实验中学杨凌校区', grades: '初一, 初二, 初三,\n高一, 高二, 高三', positions: '班主任, 任课教师', subject: '数学', phone: '18590939698' },
    { id: '7', name: '张博', gender: '男', school: '长水实验中学杨凌校区', grades: '初一, 初二, 初三,\n高一, 高二, 高三', positions: '任课教师', subject: '', phone: '17777886699' },
    { id: '8', name: '李咪', gender: '女', school: '长水实验中学杨凌校区', grades: '初一, 初二, 初三,\n高一, 高二, 高三', positions: '任课教师, 年级主任', subject: '地理', phone: '13523456789' },
    { id: '9', name: '魏春妮', gender: '女', school: '长水实验中学杨凌校区', grades: '初一, 初二, 初三,\n高一, 高二, 高三', positions: '任课教师', subject: '政治', phone: '18314415835' },
    { id: '10', name: '龙籽蓉', gender: '女', school: '长水实验中学杨凌校区', grades: '初一', positions: '班主任, 任课教师', subject: '英语', phone: '18468031485' },
];


// --- Sub-Components ---

const SchoolList: React.FC = () => {
    const [schools, setSchools] = useState<School[]>(SCHOOLS);
    const [view, setView] = useState<'list' | 'edit'>('list');
    const [editForm, setEditForm] = useState<School | null>(null);

    const handleEditClick = (school: School) => {
        setEditForm({ ...school });
        setView('edit');
    };

    const handleSave = () => {
        if (editForm) {
            setSchools(schools.map(s => s.id === editForm.id ? editForm : s));
            setView('list');
            setEditForm(null);
        }
    };

    const handleCancel = () => {
        setView('list');
        setEditForm(null);
    };

    if (view === 'edit' && editForm) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <span className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer" onClick={handleCancel}>校区管理</span>
                    <span>-&gt;</span>
                    <span className="font-bold text-slate-800">校区管理-信息维护</span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-8">
                    {/* Basic Info */}
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            <div className="flex items-center space-x-4">
                                <label className="w-24 text-sm font-medium text-slate-600 text-right">学校名称</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="w-24 text-sm font-medium text-slate-600 text-right">学校类型</label>
                                <select
                                    value={editForm.type}
                                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                    className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">请选择类型</option>
                                    <option value="民办">民办</option>
                                    <option value="公办">公办</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-4 col-span-1 md:col-span-2">
                                <label className="w-24 text-sm font-medium text-slate-600 text-right">学校地址</label>
                                <div className="flex flex-1 space-x-2">
                                     {/* Mocking address selection parts for visual similarity */}
                                     <select className="rounded-md border border-slate-200 px-3 py-2 text-sm bg-white w-24"><option>陕西省</option></select>
                                     <select className="rounded-md border border-slate-200 px-3 py-2 text-sm bg-white w-24"><option>咸阳市</option></select>
                                     <select className="rounded-md border border-slate-200 px-3 py-2 text-sm bg-white w-24"><option>杨陵区</option></select>
                                     <input
                                        type="text"
                                        value={editForm.address.replace('陕西省咸阳市杨陵区', '')} // Simple visual hack
                                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} // In real app, handle address structure
                                        className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        placeholder="详细地址"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="w-24 text-sm font-medium text-slate-600 text-right">执行校长</label>
                                <input
                                    type="text"
                                    value={editForm.principal}
                                    onChange={(e) => setEditForm({ ...editForm, principal: e.target.value })}
                                    className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="w-24 text-sm font-medium text-slate-600 text-right">联系方式</label>
                                <input
                                    type="text"
                                    value={editForm.contact}
                                    onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                                    placeholder="请输入联系方式"
                                    className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                             <div className="flex items-center space-x-4">
                                <label className="w-24 text-sm font-medium text-slate-600 text-right">学生人数</label>
                                <input
                                    type="number"
                                    value={editForm.studentCount}
                                    onChange={(e) => setEditForm({ ...editForm, studentCount: Number(e.target.value) })}
                                    className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                             <div className="flex items-center space-x-4">
                                <label className="w-24 text-sm font-medium text-slate-600 text-right">教师人数</label>
                                <input
                                    type="number"
                                    value={editForm.teacherCount}
                                    onChange={(e) => setEditForm({ ...editForm, teacherCount: Number(e.target.value) })}
                                    className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="w-24 text-sm font-medium text-slate-600 text-right">学段</label>
                                <input
                                    type="text"
                                    value={editForm.stages}
                                    onChange={(e) => setEditForm({ ...editForm, stages: e.target.value })}
                                    className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none"
                                    placeholder="例如: 初中,高中"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="w-24 text-sm font-medium text-slate-600 text-right">年级数量</label>
                                <input
                                    type="number"
                                    value={editForm.gradeCount}
                                    onChange={(e) => setEditForm({ ...editForm, gradeCount: Number(e.target.value) })}
                                    className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="w-24 text-sm font-medium text-slate-600 text-right">班级数量</label>
                                <input
                                    type="number"
                                    value={editForm.classCount}
                                    onChange={(e) => setEditForm({ ...editForm, classCount: Number(e.target.value) })}
                                    className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-4 mt-8">
                        <button
                            onClick={handleSave}
                            className="rounded-md bg-green-500 px-8 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none shadow-sm"
                        >
                            保存
                        </button>
                         <button
                            onClick={handleCancel}
                            className="rounded-md border border-slate-300 bg-white px-8 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
                        >
                            取消
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                   <thead className="bg-slate-50">
                      <tr>
                         <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">学校名称</th>
                         <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">学校类型</th>
                         <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">学校地址</th>
                         <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">执行校长</th>
                         <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">联系方式</th>
                         <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">学生人数</th>
                         <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">教师人数</th>
                         <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">学段</th>
                         <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">年级数量</th>
                         <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">班级数量</th>
                         <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
                      </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-slate-200">
                      {schools.map(school => (
                          <tr key={school.id} className="hover:bg-slate-50">
                              <td className="px-4 py-4 text-sm text-slate-900">{school.name}</td>
                              <td className="px-4 py-4 text-sm text-slate-600">{school.type}</td>
                              <td className="px-4 py-4 text-sm text-slate-600 max-w-xs truncate" title={school.address}>{school.address}</td>
                              <td className="px-4 py-4 text-sm text-slate-600">{school.principal}</td>
                              <td className="px-4 py-4 text-sm text-slate-600">{school.contact}</td>
                              <td className="px-4 py-4 text-sm text-slate-600">{school.studentCount}</td>
                              <td className="px-4 py-4 text-sm text-slate-600">{school.teacherCount}</td>
                              <td className="px-4 py-4 text-sm text-slate-600">{school.stages}</td>
                              <td className="px-4 py-4 text-sm text-slate-600">{school.gradeCount}</td>
                              <td className="px-4 py-4 text-sm text-slate-600">{school.classCount}</td>
                              <td className="px-4 py-4 text-sm">
                                  <button 
                                      onClick={() => handleEditClick(school)}
                                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                                  >
                                      编辑
                                  </button>
                              </td>
                          </tr>
                      ))}
                   </tbody>
                </table>
                 {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-center space-x-2 text-sm text-slate-600">
                     <span>共 {schools.length} 条</span>
                     <select className="border-slate-300 rounded text-sm py-1 focus:ring-blue-500 focus:border-blue-500 outline-none">
                         <option>10条/页</option>
                     </select>
                     <button className="px-2 py-1 text-slate-400 hover:text-blue-600">&lt;</button>
                     <button className="px-2 py-1 text-blue-600 font-bold">1</button>
                     <button className="px-2 py-1 text-slate-600 hover:text-blue-600">&gt;</button>
                     <span>前往</span>
                     <input type="text" defaultValue="1" className="w-10 border border-slate-300 rounded text-center py-1 focus:ring-blue-500 focus:border-blue-500 outline-none"/>
                     <span>页</span>
                </div>
             </div>
        </div>
    );
};

const ClassList: React.FC = () => {
    const [view, setView] = useState<'list' | 'edit'>('list');
    const [classes, setClasses] = useState<ClassInfo[]>(MOCK_CLASSES);
    const [editForm, setEditForm] = useState<ClassInfo | null>(null);
    const [filterSchool, setFilterSchool] = useState('长水实验中学杨凌校区');
    const [filterGrade, setFilterGrade] = useState('');
    const [filterClass, setFilterClass] = useState('');

    const handleEditClick = (cls: ClassInfo) => {
        setEditForm({ ...cls });
        setView('edit');
    };

    const handleBack = () => {
        setView('list');
        setEditForm(null);
    };

    const handleSave = () => {
        if (editForm) {
            setClasses(classes.map(c => c.id === editForm.id ? editForm : c));
            setView('list');
            setEditForm(null);
        }
    }
    
    const handleRemoveSubjectTeacher = (subject: string) => {
        if (!editForm) return;
        const newTeachers = { ...editForm.teachers };
        delete newTeachers[subject];
        setEditForm({ ...editForm, teachers: newTeachers });
    }

    if (view === 'edit' && editForm) {
        return (
            <div className="space-y-6">
                 <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <span className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer" onClick={handleBack}>班级管理</span>
                    <span>-&gt;</span>
                    <span className="font-bold text-slate-800">班级管理-编辑</span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-8">
                     {/* Basic Info */}
                     <div>
                        <h3 className="text-base font-bold text-slate-800 mb-6">基础信息</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="flex items-center space-x-3">
                                <label className="w-20 text-sm font-medium text-slate-600 text-right"><span className="text-red-500 mr-1">*</span>学校</label>
                                <select 
                                    className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    value={editForm.school}
                                    onChange={(e) => setEditForm({...editForm, school: e.target.value})}
                                >
                                    <option value="长水实验中学杨凌校区">长水实验中学杨凌校区</option>
                                </select>
                             </div>
                             <div className="flex items-center space-x-3">
                                <label className="w-20 text-sm font-medium text-slate-600 text-right"><span className="text-red-500 mr-1">*</span>班级名称</label>
                                <input 
                                    type="text" 
                                    className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                />
                             </div>
                             <div className="flex items-center space-x-3">
                                <label className="w-20 text-sm font-medium text-slate-600 text-right"><span className="text-red-500 mr-1">*</span>学段</label>
                                <select 
                                    className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    value={editForm.stage}
                                    onChange={(e) => setEditForm({...editForm, stage: e.target.value})}
                                >
                                    <option value="初中">初中</option>
                                    <option value="高中">高中</option>
                                </select>
                             </div>
                              <div className="flex items-center space-x-3">
                                <label className="w-20 text-sm font-medium text-slate-600 text-right"><span className="text-red-500 mr-1">*</span>年级</label>
                                <select 
                                    className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    value={editForm.grade}
                                    onChange={(e) => setEditForm({...editForm, grade: e.target.value})}
                                >
                                    <option value="初一">初一</option>
                                    <option value="初二">初二</option>
                                    <option value="初三">初三</option>
                                    <option value="高一">高一</option>
                                </select>
                             </div>
                        </div>
                     </div>

                     {/* Teacher Info */}
                     <div>
                        <h3 className="text-base font-bold text-slate-800 mb-6">教师信息</h3>
                        <div className="space-y-4">
                             <div className="flex items-center space-x-3 max-w-md">
                                <label className="w-20 text-sm font-medium text-slate-600 text-right">班主任</label>
                                <input 
                                    type="text" 
                                    className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    value={editForm.headTeacher}
                                    onChange={(e) => setEditForm({...editForm, headTeacher: e.target.value})}
                                />
                             </div>
                             <div className="flex items-center space-x-3">
                                <label className="w-20 text-sm font-medium text-slate-600 text-right">任课教师</label>
                                <select className="w-32 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                                    <option>请选择学科</option>
                                    <option>心理</option>
                                    <option>美术</option>
                                </select>
                                <select className="w-32 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                                    <option>请选择学科</option>
                                </select>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors">添加</button>
                             </div>
                             <div className="flex flex-wrap gap-2 pl-24">
                                 {Object.entries(editForm.teachers).map(([subject, teacher]) => {
                                     // Map subject key to chinese label if needed, here just keeping simple logic
                                     const subjectMap: Record<string, string> = {
                                         chinese: '语文', math: '数学', english: '英语', physics: '物理', chemistry: '化学',
                                         biology: '生物', geography: '地理', politics: '政治', history: '历史', morality: '道德与法治',
                                         it: '信息技术', pe: '体育', music: '音乐'
                                     };
                                     const label = subjectMap[subject] || subject;
                                     return (
                                         <div key={subject} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100">
                                             <span>{label}: {teacher}</span>
                                             <button 
                                                onClick={() => handleRemoveSubjectTeacher(subject)}
                                                className="ml-2 text-blue-400 hover:text-blue-600"
                                             >
                                                <X size={14} />
                                             </button>
                                         </div>
                                     );
                                 })}
                             </div>
                        </div>
                     </div>

                     {/* Student Info */}
                     <div>
                        <h3 className="text-base font-bold text-slate-800 mb-6">学生信息</h3>
                        <div className="space-y-6">
                            <div>
                                <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors mb-4">
                                    导入学生座位表 <ChevronDown size={14} className="ml-1" />
                                </button>
                                <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-lg border border-slate-100 min-h-[100px]">
                                    {editForm.allStudents?.map((stu, idx) => (
                                         <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{stu}</span>
                                    ))}
                                    {(!editForm.allStudents || editForm.allStudents.length === 0) && <span className="text-slate-400 text-sm">暂无学生信息</span>}
                                </div>
                                <div className="text-right text-xs text-slate-400 mt-1">提示: 点击学生姓名可进行编辑操作</div>
                            </div>

                             <div>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors mb-4">
                                    编辑座位表
                                </button>
                                {/* Seating Chart Grid */}
                                <div className="overflow-x-auto pb-4">
                                     <div className="flex space-x-4 min-w-max">
                                         {editForm.seatingGroups?.map(group => (
                                             <div key={group.id} className="w-32 flex-shrink-0">
                                                 <div className="text-center font-medium text-sm text-slate-700 mb-2">{group.name}</div>
                                                 <div className="space-y-2">
                                                     {group.students.map((stu, idx) => (
                                                         <div key={idx} className="bg-white border border-slate-200 rounded py-2 px-1 text-center text-sm text-slate-700 shadow-sm h-10 flex items-center justify-center">
                                                             {stu}
                                                         </div>
                                                     ))}
                                                     {/* Fill empty slots visually if needed */}
                                                     {Array.from({ length: Math.max(0, 8 - group.students.length) }).map((_, idx) => (
                                                         <div key={`empty-${idx}`} className="h-10"></div>
                                                     ))}
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                </div>
                             </div>
                        </div>
                     </div>

                      {/* Action Buttons */}
                    <div className="flex space-x-4 pt-4 mt-8">
                        <button
                            onClick={handleBack}
                            className="rounded-md border border-slate-300 bg-white px-8 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
                        >
                            取消
                        </button>
                        <button
                            onClick={handleSave}
                            className="rounded-md bg-blue-500 px-8 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none shadow-sm"
                        >
                            保存
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
             {/* Filter Bar */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-6 flex-1 flex-wrap gap-y-4">
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-slate-600 whitespace-nowrap">学校</label>
                            <select 
                                className="block w-60 rounded-md border border-slate-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none text-slate-700"
                                value={filterSchool}
                                onChange={(e) => setFilterSchool(e.target.value)}
                            >
                                <option>长水实验中学杨凌校区</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-slate-600 whitespace-nowrap">年级</label>
                            <select 
                                className="block w-40 rounded-md border border-slate-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none text-slate-500"
                                value={filterGrade}
                                onChange={(e) => setFilterGrade(e.target.value)}
                            >
                                <option value="">请选择年级</option>
                                <option value="初一">初一</option>
                            </select>
                        </div>
                         <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-slate-600 whitespace-nowrap">班级</label>
                            <select 
                                className="block w-40 rounded-md border border-slate-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none text-slate-500"
                                value={filterClass}
                                onChange={(e) => setFilterClass(e.target.value)}
                            >
                                <option value="">请选择班级</option>
                            </select>
                        </div>
                    </div>
                     <div className="flex space-x-3">
                         <button className="rounded-md bg-blue-500 px-6 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none">
                            查询
                         </button>
                         <button className="rounded-md border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none">
                            重置
                         </button>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex space-x-3">
                <button className="rounded-md bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none">
                    批量升级
                </button>
                <button className="rounded-md bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none">
                    升级设置
                </button>
                 <button className="rounded-md bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none">
                    班级座位表
                </button>
                <button className="rounded-md bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none">
                    新增班级
                </button>
            </div>

            {/* Table */}
             <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-max w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-center"><input type="checkbox" className="rounded border-slate-300" /></th>
                            <th className="px-4 py-3 text-center font-medium text-slate-500">序号</th>
                            <th className="px-4 py-3 text-center font-medium text-slate-500">班级</th>
                            <th className="px-4 py-3 text-center font-medium text-slate-500">年级</th>
                            <th className="px-4 py-3 text-center font-medium text-slate-500">学段</th>
                            <th className="px-4 py-3 text-center font-medium text-slate-500">学校</th>
                            <th className="px-4 py-3 text-center font-medium text-slate-500">班主任</th>
                            <th className="px-2 py-3 text-center font-medium text-slate-500">语文</th>
                            <th className="px-2 py-3 text-center font-medium text-slate-500">数学</th>
                            <th className="px-2 py-3 text-center font-medium text-slate-500">英语</th>
                            <th className="px-2 py-3 text-center font-medium text-slate-500">物理</th>
                            <th className="px-2 py-3 text-center font-medium text-slate-500">化学</th>
                            <th className="px-2 py-3 text-center font-medium text-slate-500">生物</th>
                            <th className="px-2 py-3 text-center font-medium text-slate-500">地理</th>
                            <th className="px-2 py-3 text-center font-medium text-slate-500">政治</th>
                            <th className="px-2 py-3 text-center font-medium text-slate-500">历史</th>
                            <th className="px-2 py-3 text-center font-medium text-slate-500">道德与法治</th>
                            <th className="px-2 py-3 text-center font-medium text-slate-500">信息技术</th>
                            <th className="px-2 py-3 text-center font-medium text-slate-500">体育</th>
                            <th className="px-2 py-3 text-center font-medium text-slate-500">音乐</th>
                            <th className="px-4 py-3 text-center font-medium text-slate-500 sticky right-0 bg-slate-50">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {classes.map((cls, idx) => (
                            <tr key={cls.id} className="hover:bg-slate-50 text-center">
                                <td className="px-4 py-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                                <td className="px-4 py-4 text-slate-500">{idx + 1}</td>
                                <td className="px-4 py-4 font-medium text-slate-900">{cls.name}</td>
                                <td className="px-4 py-4 text-slate-600">{cls.grade}</td>
                                <td className="px-4 py-4 text-slate-600">{cls.stage}</td>
                                <td className="px-4 py-4 text-slate-600">{cls.school}</td>
                                <td className="px-4 py-4 text-slate-600">{cls.headTeacher}</td>
                                <td className="px-2 py-4 text-slate-600">{cls.teachers.chinese}</td>
                                <td className="px-2 py-4 text-slate-600">{cls.teachers.math}</td>
                                <td className="px-2 py-4 text-slate-600">{cls.teachers.english}</td>
                                <td className="px-2 py-4 text-slate-600">{cls.teachers.physics}</td>
                                <td className="px-2 py-4 text-slate-600">{cls.teachers.chemistry}</td>
                                <td className="px-2 py-4 text-slate-600">{cls.teachers.biology}</td>
                                <td className="px-2 py-4 text-slate-600">{cls.teachers.geography}</td>
                                <td className="px-2 py-4 text-slate-600">{cls.teachers.politics}</td>
                                <td className="px-2 py-4 text-slate-600">{cls.teachers.history}</td>
                                <td className="px-2 py-4 text-slate-600">{cls.teachers.morality}</td>
                                <td className="px-2 py-4 text-slate-600">{cls.teachers.it}</td>
                                <td className="px-2 py-4 text-slate-600">{cls.teachers.pe}</td>
                                <td className="px-2 py-4 text-slate-600">{cls.teachers.music}</td>
                                <td className="px-4 py-4 whitespace-nowrap sticky right-0 bg-white shadow-[-5px_0px_5px_-5px_rgba(0,0,0,0.1)]">
                                     <div className="flex justify-center space-x-2">
                                        <button onClick={() => handleEditClick(cls)} className="text-blue-500 hover:text-blue-700 text-xs">编辑</button>
                                        <button className="text-blue-500 hover:text-blue-700 text-xs">删除</button>
                                        <button className="text-blue-500 hover:text-blue-700 text-xs">查看</button>
                                        <button className="text-blue-500 hover:text-blue-700 text-xs">升级</button>
                                     </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>

              {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-center space-x-2 text-sm text-slate-600">
                    <span>共 {classes.length} 条</span>
                    <select className="border-slate-300 rounded text-sm py-1 focus:ring-blue-500 focus:border-blue-500 outline-none">
                        <option>10条/页</option>
                    </select>
                    <button className="px-2 py-1 text-slate-400 hover:text-blue-600">&lt;</button>
                    <button className="px-2 py-1 text-blue-600 font-bold">1</button>
                    <button className="px-2 py-1 text-slate-600 hover:text-blue-600">&gt;</button>
                    <span>前往</span>
                    <input type="text" defaultValue="1" className="w-10 border border-slate-300 rounded text-center py-1 focus:ring-blue-500 focus:border-blue-500 outline-none"/>
                    <span>页</span>
            </div>
        </div>
    )
}

const TeacherList: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
    const [view, setView] = useState<'list' | 'edit'>('list');
    const [editForm, setEditForm] = useState<Teacher | null>(null);

    const [filterSchool, setFilterSchool] = useState('长水实验中学杨凌校区');
    const [filterGrade, setFilterGrade] = useState('');
    const [filterClass, setFilterClass] = useState('');
    const [filterPosition, setFilterPosition] = useState('');
    const [filterSubject, setFilterSubject] = useState('');
    const [filterName, setFilterName] = useState('');

    const handleSearch = () => {
        // Implement filtering logic here
        const filtered = MOCK_TEACHERS.filter(t => {
            return (
                (!filterSchool || t.school.includes(filterSchool)) &&
                (!filterGrade || filterGrade === '请选择年级' || t.grades.includes(filterGrade)) &&
                (!filterPosition || filterPosition === '请选择岗位' || t.positions.includes(filterPosition)) &&
                (!filterSubject || filterSubject === '请选择学科' || t.subject.includes(filterSubject)) &&
                (!filterName || t.name.includes(filterName))
            );
        });
        setTeachers(filtered);
    };

    const handleReset = () => {
        setFilterSchool('长水实验中学杨凌校区');
        setFilterGrade('');
        setFilterClass('');
        setFilterPosition('');
        setFilterSubject('');
        setFilterName('');
        setTeachers(MOCK_TEACHERS);
    };

    const handleEditClick = (teacher: Teacher) => {
        setEditForm({ ...teacher });
        setView('edit');
    };

    const handleSave = () => {
        if (editForm) {
            setTeachers(teachers.map(t => t.id === editForm.id ? editForm : t));
            setView('list');
            setEditForm(null);
        }
    };

    const handleBack = () => {
        setView('list');
        setEditForm(null);
    };

    const handleExport = () => {
        const headers = ['序号', '姓名', '性别', '学校', '年级', '岗位', '学科', '联系方式'];
        const rows = teachers.map((t, index) => [
            index + 1,
            t.name,
            t.gender,
            t.school,
            t.grades.replace(/\n/g, ' '),
            t.positions,
            t.subject,
            t.phone
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `教师名单_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (view === 'edit' && editForm) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <span className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer" onClick={handleBack}>教师管理</span>
                    <span>-&gt;</span>
                    <span className="font-bold text-slate-800">教师管理-编辑</span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-8">
                    {/* Basic Info */}
                    <div>
                        <h3 className="text-base font-bold text-slate-800 mb-6">基础信息</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="flex items-center space-x-4">
                                <label className="w-24 text-sm font-medium text-slate-600 text-right"><span className="text-red-500 mr-1">*</span>姓名</label>
                                <input 
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="w-24 text-sm font-medium text-slate-600 text-right"><span className="text-red-500 mr-1">*</span>性别</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="radio" 
                                            name="gender" 
                                            value="男" 
                                            checked={editForm.gender === '男'} 
                                            onChange={() => setEditForm({...editForm, gender: '男'})}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-slate-700">男</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="radio" 
                                            name="gender" 
                                            value="女" 
                                            checked={editForm.gender === '女'} 
                                            onChange={() => setEditForm({...editForm, gender: '女'})}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-slate-700">女</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="w-24 text-sm font-medium text-slate-600 text-right"><span className="text-red-500 mr-1">*</span>联系电话</label>
                                <input 
                                    type="text"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                    className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Teaching Info */}
                    <div>
                        <h3 className="text-base font-bold text-slate-800 mb-6">教学信息</h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="flex items-center space-x-4">
                                <label className="w-24 text-sm font-medium text-slate-600 text-right"><span className="text-red-500 mr-1">*</span>所属学校</label>
                                <select 
                                    value={editForm.school}
                                    onChange={(e) => setEditForm({...editForm, school: e.target.value})}
                                    className="w-full md:w-1/3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="长水实验中学杨凌校区">长水实验中学杨凌校区</option>
                                </select>
                            </div>

                            <div className="flex items-start space-x-4">
                                <label className="w-24 text-sm font-medium text-slate-600 text-right mt-2">年级</label>
                                <textarea 
                                    rows={2}
                                    value={editForm.grades}
                                    onChange={(e) => setEditForm({...editForm, grades: e.target.value})}
                                    className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder="请输入年级，如：高二"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="w-24 text-sm font-medium text-slate-600 text-right">岗位</label>
                                <input 
                                    type="text"
                                    value={editForm.positions}
                                    onChange={(e) => setEditForm({...editForm, positions: e.target.value})}
                                    className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder="例如：班主任, 任课教师"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="w-24 text-sm font-medium text-slate-600 text-right">学科</label>
                                <select 
                                    value={editForm.subject}
                                    onChange={(e) => setEditForm({...editForm, subject: e.target.value})}
                                    className="w-full md:w-1/3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">请选择学科</option>
                                    <option value="语文">语文</option>
                                    <option value="数学">数学</option>
                                    <option value="英语">英语</option>
                                    <option value="物理">物理</option>
                                    <option value="化学">化学</option>
                                    <option value="生物">生物</option>
                                    <option value="政治">政治</option>
                                    <option value="历史">历史</option>
                                    <option value="地理">地理</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    {/* Buttons */}
                    <div className="flex space-x-4 pt-4 border-t border-slate-100">
                        <button 
                            onClick={handleBack}
                            className="rounded-md border border-slate-300 bg-white px-8 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
                        >
                            取消
                        </button>
                        <button 
                            onClick={handleSave}
                            className="rounded-md bg-blue-500 px-8 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none"
                        >
                            保存
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
             {/* Filter Bar */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-slate-600 whitespace-nowrap w-10 text-right">学校</label>
                            <select
                                className="block w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none text-slate-700"
                                value={filterSchool}
                                onChange={(e) => setFilterSchool(e.target.value)}
                            >
                                <option>长水实验中学杨凌校区</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                             <label className="text-sm font-medium text-slate-600 whitespace-nowrap w-10 text-right">年级</label>
                             <select
                                className="block w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none text-slate-500"
                                value={filterGrade}
                                onChange={(e) => setFilterGrade(e.target.value)}
                             >
                                 <option value="">请选择年级</option>
                                 <option value="初一">初一</option>
                                 <option value="高二">高二</option>
                             </select>
                        </div>
                        <div className="flex items-center space-x-2">
                             <label className="text-sm font-medium text-slate-600 whitespace-nowrap w-10 text-right">班级</label>
                             <select
                                className="block w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none text-slate-500"
                                value={filterClass}
                                onChange={(e) => setFilterClass(e.target.value)}
                             >
                                 <option value="">请选择班级</option>
                             </select>
                        </div>
                        <div className="flex items-center space-x-2">
                             <label className="text-sm font-medium text-slate-600 whitespace-nowrap w-10 text-right">岗位</label>
                             <select
                                className="block w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none text-slate-500"
                                value={filterPosition}
                                onChange={(e) => setFilterPosition(e.target.value)}
                             >
                                 <option value="">请选择岗位</option>
                                 <option value="班主任">班主任</option>
                                 <option value="任课教师">任课教师</option>
                             </select>
                        </div>
                         <div className="flex items-center space-x-2">
                             <label className="text-sm font-medium text-slate-600 whitespace-nowrap w-10 text-right">学科</label>
                             <select
                                className="block w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none text-slate-500"
                                value={filterSubject}
                                onChange={(e) => setFilterSubject(e.target.value)}
                             >
                                 <option value="">请选择学科</option>
                                 <option value="语文">语文</option>
                                 <option value="数学">数学</option>
                                 <option value="英语">英语</option>
                             </select>
                        </div>
                        <div className="flex items-center space-x-2">
                             <label className="text-sm font-medium text-slate-600 whitespace-nowrap w-10 text-right">姓名</label>
                             <input
                                type="text"
                                className="block w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none placeholder-slate-400"
                                placeholder="请输入姓名"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                             />
                        </div>
                         <div className="flex items-center space-x-3 col-span-1 md:col-span-2 lg:col-span-2 justify-end">
                             <button
                                onClick={handleSearch}
                                className="rounded-md bg-blue-500 px-6 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none"
                             >
                                查询
                             </button>
                             <button
                                onClick={handleReset}
                                className="rounded-md border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
                             >
                                重置
                             </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex space-x-3">
                 <button
                    onClick={handleExport}
                    className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none flex items-center"
                >
                    <span className="mr-1">导出名单</span>
                </button>
            </div>

             {/* Table */}
             <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">序号</th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">姓名</th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">性别</th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">学校</th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500 max-w-xs">年级</th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">岗位</th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">学科</th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">联系方式</th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">操作</th>
                        </tr>
                    </thead>
                     <tbody className="divide-y divide-slate-200 bg-white">
                        {teachers.map((teacher, index) => (
                            <tr key={teacher.id} className="hover:bg-slate-50 text-center">
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{index + 1}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{teacher.name}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{teacher.gender}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{teacher.school}</td>
                                <td className="whitespace-pre-wrap px-6 py-4 text-sm text-slate-600 max-w-xs">{teacher.grades}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{teacher.positions}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{teacher.subject}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{teacher.phone}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                    <div className="flex justify-center space-x-3">
                                        <button 
                                            onClick={() => handleEditClick(teacher)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            编辑
                                        </button>
                                        <button className="text-blue-500 hover:text-blue-700">查看</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                     </tbody>
                </table>
                 {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-center space-x-2 text-sm text-slate-600">
                     <span>共 {teachers.length} 条</span>
                     <select className="border-slate-300 rounded text-sm py-1 focus:ring-blue-500 focus:border-blue-500 outline-none">
                         <option>10条/页</option>
                     </select>
                     <button className="px-2 py-1 text-slate-400 hover:text-blue-600">&lt;</button>
                     <button className="px-2 py-1 text-blue-600 font-bold">1</button>
                     <button className="px-2 py-1 text-slate-600 hover:text-blue-600">&gt;</button>
                     <button className="px-2 py-1 text-slate-600 hover:text-blue-600">...</button>
                     <button className="px-2 py-1 text-slate-600 hover:text-blue-600">15</button>
                     <button className="px-2 py-1 text-slate-600 hover:text-blue-600">&gt;</button>
                     <span>前往</span>
                     <input type="text" defaultValue="1" className="w-10 border border-slate-300 rounded text-center py-1 focus:ring-blue-500 focus:border-blue-500 outline-none"/>
                     <span>页</span>
                </div>
             </div>
        </div>
    );
};

const StudentList: React.FC = () => {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [students, setStudents] = useState<Student[]>(STUDENTS);
  const [editForm, setEditForm] = useState<Student | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Filter States
  const [filterSchool, setFilterSchool] = useState('长水实验中学杨凌校区');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterName, setFilterName] = useState('');

  const handleEditClick = (student: Student) => {
    setEditForm({ ...student });
    setView('edit');
  };

  const handleSave = () => {
    if (editForm) {
      setStudents(students.map(s => s.id === editForm.id ? editForm : s));
      setView('list');
      setEditForm(null);
    }
  };

  const handleBack = () => {
    setView('list');
    setEditForm(null);
  };
  
  const handleSearch = () => {
      const filtered = STUDENTS.filter(s => {
          return (!filterGrade || filterGrade === '请选择年级' || s.grade === filterGrade) &&
                 (!filterClass || filterClass === '请选择班级' || s.class === filterClass) &&
                 (!filterName || s.name.includes(filterName));
      });
      setStudents(filtered);
  }

  const handleReset = () => {
      setFilterGrade('');
      setFilterClass('');
      setFilterName('');
      setStudents(STUDENTS);
  }

  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          alert(`已成功选择文件: ${file.name}\n正在解析导入... (系统演示：导入成功)`);
          event.target.value = '';
      }
  };

  const handleExport = () => {
      const headers = ['姓名', '性别', '学号', '学校', '年级', '班级', '楼栋', '楼层', '宿舍号', '床位号', '创建时间'];
      const rows = students.map(s => [
          s.name,
          s.gender,
          s.id,
          s.school,
          s.grade,
          s.class,
          s.building,
          s.floor,
          s.dorm,
          s.bedNo,
          s.createTime
      ]);

      const csvContent = [
          headers.join(','),
          ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `学生名单_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  if (view === 'edit' && editForm) {
      return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
                <span className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer" onClick={handleBack}>学生管理</span> 
                <span>-&gt;</span>
                <span className="font-bold text-slate-800">学生管理-编辑</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-8">
                 {/* Basic Info */}
                 <div>
                    <h3 className="text-base font-bold text-slate-800 mb-6 border-l-4 border-slate-800 pl-2">基础信息</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex items-center space-x-4">
                            <label className="w-24 text-sm font-medium text-slate-600 text-right"><span className="text-red-500 mr-1">*</span>姓名</label>
                            <input 
                                type="text" 
                                value={editForm.name} 
                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="w-24 text-sm font-medium text-slate-600 text-right"><span className="text-red-500 mr-1">*</span>性别</label>
                            <select 
                                value={editForm.gender} 
                                onChange={(e) => setEditForm({...editForm, gender: e.target.value as '男' | '女'})}
                                className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            >
                                <option value="男">男</option>
                                <option value="女">女</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="w-24 text-sm font-medium text-slate-600 text-right"><span className="text-red-500 mr-1">*</span>学号</label>
                            <input 
                                type="text" 
                                value={editForm.id} 
                                disabled
                                className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                            />
                        </div>
                         <div className="flex items-center space-x-4">
                            <label className="w-24 text-sm font-medium text-slate-600 text-right"><span className="text-red-500 mr-1">*</span>学校</label>
                            <select 
                                value={editForm.school}
                                onChange={(e) => setEditForm({...editForm, school: e.target.value})}
                                className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            >
                                <option value="长水实验中学杨凌校区">长水实验中学杨凌校区</option>
                            </select>
                        </div>
                    </div>
                 </div>

                 {/* Academic Info */}
                 <div>
                    <h3 className="text-base font-bold text-slate-800 mb-6 border-l-4 border-slate-800 pl-2">班级信息</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex items-center space-x-4">
                            <label className="w-24 text-sm font-medium text-slate-600 text-right"><span className="text-red-500 mr-1">*</span>年级</label>
                            <select 
                                value={editForm.grade}
                                onChange={(e) => setEditForm({...editForm, grade: e.target.value})}
                                className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            >
                                <option value="初一">初一</option>
                                <option value="初二">初二</option>
                                <option value="高一">高一</option>
                                <option value="高二">高二</option>
                                <option value="高三">高三</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="w-24 text-sm font-medium text-slate-600 text-right"><span className="text-red-500 mr-1">*</span>班级</label>
                            <select 
                                value={editForm.class}
                                onChange={(e) => setEditForm({...editForm, class: e.target.value})}
                                className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            >
                                <option value="37班">37班</option>
                                <option value="38班">38班</option>
                                <option value="1班">1班</option>
                            </select>
                        </div>
                    </div>
                 </div>

                 {/* Accommodation Info */}
                 <div>
                    <h3 className="text-base font-bold text-slate-800 mb-6 border-l-4 border-slate-800 pl-2">住宿信息</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex items-center space-x-4">
                            <label className="w-24 text-sm font-medium text-slate-600 text-right">楼栋</label>
                            <select 
                                value={editForm.building || ''}
                                onChange={(e) => setEditForm({...editForm, building: e.target.value})}
                                className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            >
                                <option value="女生宿舍楼">女生宿舍楼</option>
                                <option value="男生宿舍楼">男生宿舍楼</option>
                            </select>
                        </div>
                         <div className="flex items-center space-x-4">
                            <label className="w-24 text-sm font-medium text-slate-600 text-right">楼层</label>
                            <input 
                                type="number"
                                value={editForm.floor || ''}
                                onChange={(e) => setEditForm({...editForm, floor: Number(e.target.value)})}
                                className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="w-24 text-sm font-medium text-slate-600 text-right">宿舍号</label>
                            <input 
                                type="text"
                                value={editForm.dorm || ''}
                                onChange={(e) => setEditForm({...editForm, dorm: e.target.value})}
                                className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="w-24 text-sm font-medium text-slate-600 text-right">床位号</label>
                            <input 
                                type="number"
                                value={editForm.bedNo || ''}
                                onChange={(e) => setEditForm({...editForm, bedNo: Number(e.target.value)})}
                                className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex space-x-4 pt-4 border-t border-slate-100">
                    <button 
                        onClick={handleBack}
                        className="rounded-md border border-slate-300 bg-white px-8 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
                    >
                        取消
                    </button>
                    <button 
                        onClick={handleSave}
                        className="rounded-md bg-blue-500 px-8 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none"
                    >
                        保存
                    </button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6 flex-1 flex-wrap gap-y-4">
                 <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-slate-600 whitespace-nowrap w-8 text-right">学校</label>
                    <select 
                        className="block w-60 rounded-md border border-slate-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                        value={filterSchool}
                        onChange={(e) => setFilterSchool(e.target.value)}
                    >
                        <option>长水实验中学杨凌校区</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-slate-600 whitespace-nowrap w-8 text-right">年级</label>
                    <select 
                        className="block w-40 rounded-md border border-slate-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-500"
                        value={filterGrade}
                        onChange={(e) => setFilterGrade(e.target.value)}
                    >
                        <option value="">请选择年级</option>
                        <option value="初一">初一</option>
                        <option value="初二">初二</option>
                        <option value="高一">高一</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-slate-600 whitespace-nowrap w-8 text-right">班级</label>
                    <select 
                        className="block w-40 rounded-md border border-slate-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-500"
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                    >
                        <option value="">请选择班级</option>
                        <option value="37班">37班</option>
                        <option value="38班">38班</option>
                    </select>
                </div>
                 <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-slate-600 whitespace-nowrap w-8 text-right">姓名</label>
                    <input 
                        type="text" 
                        placeholder="请输入姓名" 
                        className="block w-40 rounded-md border border-slate-300 bg-white py-2 px-3 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex space-x-3">
                 <button 
                    onClick={handleSearch}
                    className="rounded-md bg-blue-500 px-6 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                 >
                    查询
                 </button>
                 <button 
                    onClick={handleReset}
                    className="rounded-md border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                 >
                    重置
                 </button>
            </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex space-x-3">
        <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".xlsx,.xls,.csv"
        />
        <button 
            onClick={handleImportClick}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
        >
            <Upload className="mr-2 h-4 w-4" />
            导入名单
        </button>
        <button 
            onClick={handleExport}
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
        >
            <Download className="mr-2 h-4 w-4" />
            导出名单
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">序号</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">姓名</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">性别</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">学号</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">学校</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">年级</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">班级</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">楼栋</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">楼层</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">宿舍号</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">床位号</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">创建时间</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {students.map((student, index) => (
              <tr key={student.id} className="hover:bg-slate-50 text-center">
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{index + 1}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{student.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{student.gender}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{student.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{student.school}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{student.grade}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{student.class}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{student.building}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{student.floor}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{student.dorm}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{student.bedNo}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{student.createTime}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                   <div className="flex justify-center space-x-3">
                      <button 
                        onClick={() => handleEditClick(student)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        编辑
                      </button>
                      <button className="text-blue-500 hover:text-blue-700">查看</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-center space-x-2 text-sm text-slate-600">
             <span>共 {students.length} 条</span>
             <select className="border-slate-300 rounded text-sm py-1">
                 <option>10条/页</option>
             </select>
             <button className="px-2 py-1 text-slate-400 hover:text-blue-600">&lt;</button>
             <button className="px-2 py-1 text-blue-600 font-bold">1</button>
             <button className="px-2 py-1 text-slate-600 hover:text-blue-600">&gt;</button>
             <span>前往</span>
             <input type="text" defaultValue="1" className="w-10 border border-slate-300 rounded text-center py-1"/>
             <span>页</span>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const SchoolManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'校区管理' | '班级管理' | '教师管理' | '学生管理'>('校区管理');

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">学校管理 (School Management)</h1>
          <p className="text-slate-500 mt-1">管理校区、年级、班级、教师及学生档案。</p>
        </div>
      </div>

       {/* Tabs */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-2 shadow-sm overflow-x-auto">
        <div className="flex space-x-2">
            {(['校区管理', '班级管理', '教师管理', '学生管理'] as const).map((tab) => (
                <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
                >
                {tab}
                </button>
            ))}
        </div>
      </div>

      <div className="min-h-[500px]">
           {activeTab === '校区管理' && <SchoolList />}
           {activeTab === '学生管理' && <StudentList />}
           {activeTab === '班级管理' && <ClassList />}
           {activeTab === '教师管理' && <TeacherList />}
      </div>
    </div>
  );
};

export default SchoolManagement;
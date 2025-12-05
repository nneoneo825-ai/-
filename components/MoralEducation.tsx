import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart, 
  Line,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { Search, Map, ArrowLeft, Download } from 'lucide-react';

// --- Mock Data ---

const CLASS_DETAIL_DATA = [
  { id: 1, item: '思政教育', content: '班主任跑操结束进行班内点评', score: 0, reason: '-' },
  { id: 2, item: '课堂纪律', content: '犯困睡觉; 不抬头听课做与学习无关的事情', score: -10, reason: '学生:申哲宇: 犯困睡觉; 学生:张涵校: 不抬头听课' },
  { id: 3, item: '课间纪律', content: '课间楼道楼梯间等追逐打闹、大声喧哗', score: -10, reason: '学生:桑雨欣: 课间打闹; 学生:周锦凡: 大声喧哗' },
  { id: 4, item: '就餐纪律', content: '不按时就餐; 浪费粮食', score: -5, reason: '学生:王小明: 浪费粮食' },
  { id: 5, item: '仪容仪表', content: '未穿校服; 发型不合格', score: -4, reason: '学生:李雷: 未穿校服' },
];

interface ClassDetailRecord {
  id: number;
  student: string;
  majorCategory: string;
  minorCategory: string;
  reason: string;
  type: '加分' | '减分';
  score: number;
  time: string;
}

const MOCK_CLASS_DETAIL_RECORDS: ClassDetailRecord[] = [
  { id: 1, student: '张湄皎', majorCategory: '德育', minorCategory: '课堂纪律', reason: '不抬头听课做与学习无关的事情', type: '减分', score: 5, time: '2025-11-20 08:15:28' },
  { id: 2, student: '申哲宇', majorCategory: '德育', minorCategory: '课堂纪律', reason: '犯困睡觉', type: '减分', score: 5, time: '2025-11-20 08:15:15' },
  { id: 3, student: '李俐萦', majorCategory: '智育', minorCategory: '激情课堂', reason: '说话嬉笑', type: '减分', score: 5, time: '2025-11-20 08:15:15' },
  { id: 4, student: '张湄皎', majorCategory: '智育', minorCategory: '激情早读', reason: '东张西望不早读', type: '减分', score: 2, time: '2025-11-19 11:49:26' },
  { id: 5, student: '申哲宇', majorCategory: '智育', minorCategory: '激情早读', reason: '东张西望不早读', type: '减分', score: 2, time: '2025-11-19 11:46:35' },
  { id: 6, student: '龚雨欣', majorCategory: '德育', minorCategory: '课间纪律', reason: '课间楼道楼梯间等追逐打闹、大声喧哗、勾肩搭背等', type: '减分', score: 5, time: '2025-11-12 10:07:14' },
  { id: 7, student: '周锦凡', majorCategory: '德育', minorCategory: '课间纪律', reason: '课间楼道楼梯间等追逐打闹、大声喧哗、勾肩搭背等', type: '减分', score: 5, time: '2025-11-12 10:07:14' },
];

const GRADE_REPORT_DATA = [
  { class: '37班', headTeacher: '李思源', moral: 0, classDisc: -10, breakDisc: -10, dining: 0, dorm: 0, politeness: 0, property: 0, late: 0, passionRead: -4, passionClass: -5, selfDisc: 0, intern: 0, run: 0, eyeHealth: 0, appearance: 0, electric: 0, passionOath: 0, culture: 0, song: 0, classHygiene: 0, dormHygiene: 0, areaHygiene: 0, morningCheck: 0, totalDed: -29, perCapita: -0.52, rank: 5 },
  { class: '38班', headTeacher: '王江', moral: -5, classDisc: -5, breakDisc: 0, dining: 0, dorm: 0, politeness: 0, property: 0, late: 0, passionRead: -12, passionClass: 0, selfDisc: 0, intern: 0, run: 0, eyeHealth: 0, appearance: -2, electric: 0, passionOath: 0, culture: 0, song: 0, classHygiene: 0, dormHygiene: 0, areaHygiene: 0, morningCheck: 0, totalDed: -24, perCapita: -0.46, rank: 4 },
  { class: '39班', headTeacher: '龙籽蓉', moral: 0, classDisc: -20, breakDisc: 0, dining: 0, dorm: 0, politeness: 0, property: 0, late: -6, passionRead: -6, passionClass: 0, selfDisc: 0, intern: 0, run: 0, eyeHealth: 0, appearance: 0, electric: -5, passionOath: 0, culture: 0, song: 0, classHygiene: 0, dormHygiene: 0, areaHygiene: 0, morningCheck: 0, totalDed: -37, perCapita: -0.67, rank: 6 },
  { class: '40班', headTeacher: '陈鑫', moral: 0, classDisc: 0, breakDisc: 0, dining: 0, dorm: 0, politeness: 0, property: 0, late: 0, passionRead: -2, passionClass: 0, selfDisc: 0, intern: 0, run: 0, eyeHealth: 0, appearance: -2, electric: 0, passionOath: 0, culture: 0, song: 0, classHygiene: 0, dormHygiene: 0, areaHygiene: 0, morningCheck: 0, totalDed: -4, perCapita: -0.07, rank: 1 },
  { class: '41班', headTeacher: '韩林轩', moral: 0, classDisc: 0, breakDisc: 0, dining: 0, dorm: 0, politeness: 0, property: 0, late: 0, passionRead: -5, passionClass: 0, selfDisc: 0, intern: 0, run: 0, eyeHealth: 0, appearance: 0, electric: 0, passionOath: 0, culture: 0, song: 0, classHygiene: -5, dormHygiene: 0, areaHygiene: 0, morningCheck: 0, totalDed: -10, perCapita: -0.18, rank: 2 },
  { class: '42班', headTeacher: '陈安平', moral: 0, classDisc: -5, breakDisc: 0, dining: 0, dorm: 0, politeness: 0, property: 0, late: 0, passionRead: 0, passionClass: 0, selfDisc: 0, intern: 0, run: 0, eyeHealth: 0, appearance: -2, electric: 0, passionOath: -5, culture: 0, song: 0, classHygiene: 0, dormHygiene: 0, areaHygiene: 0, morningCheck: 0, totalDed: -12, perCapita: -0.22, rank: 3 },
];

const DORM_QUANTITATIVE_DATA = [
    { grade: '初一', class: '37班', headTeacher: '李思源', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 58, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
    { grade: '初一', class: '38班', headTeacher: '王江', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 52, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
    { grade: '初一', class: '39班', headTeacher: '龙籽蓉', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 55, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
    { grade: '初一', class: '40班', headTeacher: '陈鑫', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 56, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
    { grade: '初一', class: '41班', headTeacher: '韩林轩', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 56, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
    { grade: '初一', class: '42班', headTeacher: '陈安平', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 55, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
    { grade: '初二', class: '27班', headTeacher: '贾亚花', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 51, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
    { grade: '初二', class: '28班', headTeacher: '王佳豪', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 50, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
    { grade: '初二', class: '29班', headTeacher: '张艺欣', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 50, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
    { grade: '初二', class: '30班', headTeacher: '-', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 52, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
    { grade: '初二', class: '31班', headTeacher: '雷倩', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 50, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
    { grade: '初二', class: '32班', headTeacher: '孙少鑫', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 50, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
    { grade: '初二', class: '33班', headTeacher: '张倩', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 50, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
    { grade: '初二', class: '34班', headTeacher: '刘鹏举', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 50, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
    { grade: '初三', class: '19班', headTeacher: '吴宝鹏', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 51, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
    { grade: '初三', class: '20班', headTeacher: '李亚亚', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 50, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
    { grade: '初三', class: '21班', headTeacher: '吕句露', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 51, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
    { grade: '初三', class: '22班', headTeacher: '刘玉晨', mContent: 0, fContent: 0, content: 0, mNap: 0, fNap: 0, nap: 0, totalDed: 0, count: 50, perCapita: 0, rank: 1, score: 0, gradePerCapita: 0, gradeRank: 1 },
];

const DISTRICT_QUANTITATIVE_DATA = [
    { school: '长水实验中学杨凌校区', moral: 0, classDisc: 0, breakDisc: 0, dining: 0, dorm: 0, politeness: 0, property: 0, late: 0, passionRead: 0, passionClass: 0, selfDisc: 0, intern: 0, run: 0, eyeHealth: 0, appearance: 0, electric: 0, passionOath: 0, culture: 0, song: 0, classHygiene: 0, dormHygiene: 0, areaHygiene: 0, morningCheck: 0, totalDed: 0, perCapita: 0, rank: 1 },
];

// --- Components ---

const MoralEducation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'class' | 'grade' | 'school' | 'dorm' | 'district'>('district');

  const renderTabButton = (id: typeof activeTab, label: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        activeTab === id
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">德育量化管理 (Moral Education)</h1>
          <p className="text-slate-500 mt-1">多维度德育评价报表与分析。</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-2 shadow-sm overflow-x-auto">
        <div className="flex space-x-2">
          {renderTabButton('class', '班级报表')}
          {renderTabButton('grade', '年级报表')}
          {renderTabButton('school', '校级报表')}
          {renderTabButton('dorm', '宿舍报表')}
          {renderTabButton('district', '学区报表')}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'class' && <ClassReport />}
        {activeTab === 'grade' && <GradeReport />}
        {activeTab === 'school' && <SchoolReport />}
        {activeTab === 'dorm' && <DormReport />}
        {activeTab === 'district' && <DistrictReport />}
      </div>
    </div>
  );
};

// 1. Class Report Component
const ClassReport: React.FC = () => {
  const [view, setView] = useState<'summary' | 'detail'>('summary');

  if (view === 'detail') {
      return (
          <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex-1"></div>
                  <h2 className="text-2xl font-bold text-slate-900 text-center flex-1 whitespace-nowrap">37班 班级五育量化详情</h2>
                  <div className="flex-1 flex justify-end space-x-3">
                       <button 
                          onClick={() => setView('summary')}
                          className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center"
                       >
                           <ArrowLeft className="w-4 h-4 mr-1" />
                           返回
                       </button>
                       <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center">
                           <Download className="w-4 h-4 mr-1" />
                           导出
                       </button>
                  </div>
              </div>

              {/* Detail Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                          <tr>
                              <th className="px-6 py-4 text-center text-sm font-medium text-slate-500">学生</th>
                              <th className="px-6 py-4 text-center text-sm font-medium text-slate-500">大项</th>
                              <th className="px-6 py-4 text-center text-sm font-medium text-slate-500">小项</th>
                              <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 w-1/3">扣分项</th>
                              <th className="px-6 py-4 text-center text-sm font-medium text-slate-500">加分/减分</th>
                              <th className="px-6 py-4 text-center text-sm font-medium text-slate-500">分数</th>
                              <th className="px-6 py-4 text-center text-sm font-medium text-slate-500">时间</th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                          {MOCK_CLASS_DETAIL_RECORDS.map((record) => (
                              <tr key={record.id} className="hover:bg-slate-50">
                                  <td className="px-6 py-4 text-sm text-center text-slate-900">{record.student}</td>
                                  <td className="px-6 py-4 text-sm text-center text-slate-900">{record.majorCategory}</td>
                                  <td className="px-6 py-4 text-sm text-center text-slate-900">{record.minorCategory}</td>
                                  <td className="px-6 py-4 text-sm text-center text-slate-600">{record.reason}</td>
                                  <td className="px-6 py-4 text-sm text-center text-slate-600">{record.type}</td>
                                  <td className="px-6 py-4 text-sm text-center text-slate-900">{record.score}</td>
                                  <td className="px-6 py-4 text-sm text-center text-slate-500">{record.time}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  {/* Pagination */}
                  <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-2 text-sm text-slate-600">
                     <span>共 {MOCK_CLASS_DETAIL_RECORDS.length} 条</span>
                     <select className="border-slate-300 rounded text-sm py-1 focus:ring-blue-500 focus:border-blue-500 outline-none">
                         <option>20条/页</option>
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
  }

  return (
    <div className="space-y-6">
      {/* Header/Filter */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-center text-slate-800">37班 班级量化考核报表</h2>
        <p className="text-center text-xs text-slate-500">基于五育量化检查明细生成</p>
        
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
             <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600">学校:</span>
                    <select className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option>长水实验中学杨凌校区</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600">年级:</span>
                    <select className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option>初一</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600">班级:</span>
                    <select className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option>37班</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600">显示:</span>
                    <select className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option>全部项目</option>
                    </select>
                </div>
             </div>
             <div className="flex space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">查询</button>
                <button className="px-4 py-2 border border-slate-300 rounded text-sm hover:bg-slate-50">重置</button>
                <button 
                    onClick={() => setView('detail')}
                    className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                    查看详情
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">导出报表</button>
             </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
         <div className="flex items-center space-x-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">37班</h1>
                <span className="inline-block px-2 py-0.5 rounded border border-slate-300 text-xs text-slate-500 mt-1">李思源</span>
            </div>
         </div>
         <div className="text-right">
             <div className="text-xs text-slate-500 mb-1">报告周期</div>
             <div className="flex items-center space-x-2 text-sm text-slate-700 bg-slate-50 px-3 py-1 rounded border border-slate-200">
                 <Search className="w-4 h-4 text-slate-400" />
                 <span>2025-11-01 至 2025-11-30</span>
             </div>
             <div className="mt-2">
                 <span className="text-xs text-slate-400">总得分</span>
                 <div className="text-3xl font-bold text-green-500">-29</div>
                 <span className="text-xs text-slate-400">基础分0分</span>
             </div>
         </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex flex-col items-center justify-center">
             <span className="text-sm text-green-700 mb-1">加分项</span>
             <span className="text-2xl font-bold text-green-600">0</span>
         </div>
         <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex flex-col items-center justify-center">
             <span className="text-sm text-red-700 mb-1">扣分项</span>
             <span className="text-2xl font-bold text-red-600">-29</span>
         </div>
         <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex flex-col items-center justify-center">
             <span className="text-sm text-blue-700 mb-1">检查项目</span>
             <span className="text-2xl font-bold text-blue-600">5</span>
         </div>
         <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl flex flex-col items-center justify-center">
             <span className="text-sm text-purple-700 mb-1">排名</span>
             <span className="text-2xl font-bold text-purple-600">5</span>
         </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
             <h3 className="font-bold text-slate-800">详细评分列表</h3>
             <p className="text-xs text-slate-500">各项检查项目的得分详情</p>
         </div>
         <table className="min-w-full divide-y divide-slate-200">
             <thead className="bg-slate-50">
                 <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-16">序号</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-32">检查项目</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">检查内容</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-48">得分情况</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">扣分原因</th>
                 </tr>
             </thead>
             <tbody className="bg-white divide-y divide-slate-200">
                 {CLASS_DETAIL_DATA.map((row) => (
                     <tr key={row.id} className="hover:bg-slate-50">
                         <td className="px-6 py-4 text-sm text-slate-500">{row.id}</td>
                         <td className="px-6 py-4 text-sm font-medium text-slate-800">{row.item}</td>
                         <td className="px-6 py-4 text-sm text-slate-600">
                             <ul className="list-disc list-inside space-y-1">
                                 {row.content.split('; ').map((item, idx) => (
                                     <li key={idx}>{item}</li>
                                 ))}
                             </ul>
                         </td>
                         <td className="px-6 py-4">
                             <div className="flex items-center space-x-2">
                                 <span className={`font-bold ${row.score < 0 ? 'text-red-500' : 'text-slate-800'}`}>{row.score}</span>
                                 <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-24">
                                     <div 
                                        className={`h-full ${row.score < 0 ? 'bg-red-500' : 'bg-green-500'}`} 
                                        style={{ width: `${Math.min(Math.abs(row.score) * 5, 100)}%` }}
                                     ></div>
                                 </div>
                             </div>
                         </td>
                         <td className="px-6 py-4 text-xs text-slate-500">
                             {row.reason.split('; ').map((r, i) => (
                                 <div key={i} className="mb-1">{r}</div>
                             ))}
                         </td>
                     </tr>
                 ))}
             </tbody>
         </table>
      </div>
    </div>
  );
};

// 2. Grade Report Component
const GradeReport: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header/Filter */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col space-y-6">
                 <h2 className="text-xl font-bold text-center text-slate-800">初一 年级五育量化表</h2>
                 
                 <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center space-x-2">
                              <span className="text-sm text-slate-600">时间范围:</span>
                              <input type="date" className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500" defaultValue="2025-11-01"/>
                              <span className="text-slate-400">-</span>
                              <input type="date" className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500" defaultValue="2025-11-30"/>
                          </div>
                          <div className="flex items-center space-x-2">
                              <span className="text-sm text-slate-600">学校:</span>
                              <select className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                  <option>长水实验中学杨凌校区</option>
                              </select>
                          </div>
                          <div className="flex items-center space-x-2">
                              <span className="text-sm text-slate-600">年级:</span>
                              <select className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                  <option>初一</option>
                              </select>
                          </div>
                      </div>
                      <div className="flex space-x-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">查询</button>
                          <button className="px-4 py-2 border border-slate-300 rounded text-sm hover:bg-slate-50">重置</button>
                          <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">导出Excel</button>
                          <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">详情页</button>
                      </div>
                 </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                <div className="min-w-[1200px] p-4">
                    <div className="text-center font-bold text-slate-800 mb-2">长水教育集团长水实验中学杨凌校区初一年级部五育量化表</div>
                    <div className="text-right text-xs text-slate-500 mb-2">年级: 初一年级部 &nbsp;&nbsp; 日期: 2025-12-03</div>
                    
                    <table className="w-full border-collapse border border-slate-300 text-xs">
                        <thead className="bg-slate-50">
                            <tr>
                                <th rowSpan={2} className="border border-slate-300 px-2 py-1">班级</th>
                                <th rowSpan={2} className="border border-slate-300 px-2 py-1">班主任</th>
                                <th colSpan={7} className="border border-slate-300 px-2 py-1 bg-blue-50">德育</th>
                                <th colSpan={3} className="border border-slate-300 px-2 py-1 bg-green-50">智育</th>
                                <th colSpan={3} className="border border-slate-300 px-2 py-1 bg-yellow-50">体育</th>
                                <th colSpan={4} className="border border-slate-300 px-2 py-1 bg-purple-50">美育</th>
                                <th colSpan={3} className="border border-slate-300 px-2 py-1 bg-orange-50">劳育</th>
                                <th rowSpan={2} className="border border-slate-300 px-2 py-1">综合扣分</th>
                                <th rowSpan={2} className="border border-slate-300 px-2 py-1">人均扣分</th>
                                <th rowSpan={2} className="border border-slate-300 px-2 py-1">班级排名</th>
                            </tr>
                            <tr>
                                {/* Moral */}
                                <th className="border border-slate-300 px-1 py-1 font-normal">思政教育</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">课堂纪律</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">课间纪律</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">就餐纪律</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">午休晚休</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">文明礼貌</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">公物维护</th>
                                {/* Intellect */}
                                <th className="border border-slate-300 px-1 py-1 font-normal">迟到早退</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">激情早读</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">激情课堂</th>
                                {/* Physical */}
                                <th className="border border-slate-300 px-1 py-1 font-normal">自习纪律</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">见习生</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">激情跑操</th>
                                {/* Aesthetic */}
                                <th className="border border-slate-300 px-1 py-1 font-normal">眼保健操</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">仪容仪表</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">教室用电</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">激情宣誓</th>
                                {/* Labor */}
                                <th className="border border-slate-300 px-1 py-1 font-normal">文化建设</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">每日一歌</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">教室卫生</th>
                            </tr>
                        </thead>
                        <tbody>
                            {GRADE_REPORT_DATA.map((row, idx) => (
                                <tr key={idx} className="text-center hover:bg-slate-50">
                                    <td className="border border-slate-300 px-2 py-1.5">{row.class}</td>
                                    <td className="border border-slate-300 px-2 py-1.5">{row.headTeacher}</td>
                                    
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.moral}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.classDisc}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.breakDisc}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.dining}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.dorm}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.politeness}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.property}</td>
                                    
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.late}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.passionRead}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.passionClass}</td>
                                    
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.selfDisc}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.intern}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.run}</td>
                                    
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.eyeHealth}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.appearance}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.electric}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.passionOath}</td>
                                    
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.culture}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.song}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.classHygiene}</td>
                                    
                                    <td className="border border-slate-300 px-2 py-1.5 font-bold text-slate-800">{row.totalDed}</td>
                                    <td className="border border-slate-300 px-2 py-1.5 text-slate-600">{row.perCapita}</td>
                                    <td className="border border-slate-300 px-2 py-1.5 font-bold text-blue-600">{row.rank}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// 3. School Report Component
const SchoolReport: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col space-y-6">
                 <h2 className="text-xl font-bold text-center text-slate-800">长水实验中学杨凌校区 校级五育量化表</h2>
                 
                 <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center space-x-2">
                              <span className="text-sm text-slate-600">时间范围:</span>
                              <input type="date" className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500" defaultValue="2025-11-01"/>
                              <span className="text-slate-400">-</span>
                              <input type="date" className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500" defaultValue="2025-11-30"/>
                          </div>
                          <div className="flex items-center space-x-2">
                              <span className="text-sm text-slate-600">学校:</span>
                              <select className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                  <option>长水实验中学杨凌校区</option>
                              </select>
                          </div>
                      </div>
                      <div className="flex space-x-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">查询</button>
                          <button className="px-4 py-2 border border-slate-300 rounded text-sm hover:bg-slate-50">重置</button>
                          <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">导出Excel</button>
                          <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">详情页</button>
                      </div>
                 </div>
            </div>

            {/* School Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                 <div className="min-w-[1200px] p-4">
                    <div className="text-center font-bold text-slate-800 mb-2">长水教育集团长水实验中学杨凌校区 学生事务部五育量化表</div>
                    <div className="text-right text-xs text-slate-500 mb-2">部门: 学生事务部 &nbsp;&nbsp; 日期: 2025-12-03</div>
                    
                    <table className="w-full border-collapse border border-slate-300 text-xs">
                        <thead className="bg-slate-50">
                            <tr>
                                <th rowSpan={2} className="border border-slate-300 px-2 py-1">年级</th>
                                <th colSpan={8} className="border border-slate-300 px-2 py-1 bg-blue-50">德育</th>
                                <th colSpan={3} className="border border-slate-300 px-2 py-1 bg-green-50">智育</th>
                                <th colSpan={3} className="border border-slate-300 px-2 py-1 bg-yellow-50">体育</th>
                                <th colSpan={5} className="border border-slate-300 px-2 py-1 bg-purple-50">美育</th>
                                <th colSpan={4} className="border border-slate-300 px-2 py-1 bg-orange-50">劳育</th>
                                <th rowSpan={2} className="border border-slate-300 px-2 py-1">综合扣分</th>
                                <th rowSpan={2} className="border border-slate-300 px-2 py-1">人均扣分</th>
                                <th rowSpan={2} className="border border-slate-300 px-2 py-1">年级排名</th>
                            </tr>
                            <tr>
                                <th className="border border-slate-300 px-1 py-1 font-normal">思政教育</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">课堂纪律</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">课间纪律</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">就餐纪律</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">午休晚休</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">文明礼貌</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">公物维护</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">迟到早退</th>
                                
                                <th className="border border-slate-300 px-1 py-1 font-normal">激情早读</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">激情课堂</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">自习纪律</th>
                                
                                <th className="border border-slate-300 px-1 py-1 font-normal">见习生</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">激情跑操</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">眼保健操</th>
                                
                                <th className="border border-slate-300 px-1 py-1 font-normal">仪容仪表</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">教室用电</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">激情宣誓</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">文化建设</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">每日一歌</th>
                                
                                <th className="border border-slate-300 px-1 py-1 font-normal">教室卫生</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">寝室内务</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">区域卫生</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">晨检</th>
                            </tr>
                        </thead>
                        <tbody>
                             <tr className="text-center hover:bg-slate-50">
                                <td className="border border-slate-300 px-2 py-1.5">初一</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">-5</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">-40</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">-10</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">-6</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">-27</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">-5</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">-5</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-2 py-1.5 font-bold text-slate-800">-98</td>
                                <td className="border border-slate-300 px-2 py-1.5 text-slate-600">-0.30</td>
                                <td className="border border-slate-300 px-2 py-1.5 font-bold text-blue-600">4</td>
                             </tr>
                             <tr className="text-center hover:bg-slate-50">
                                <td className="border border-slate-300 px-2 py-1.5">初二</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">-25</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">-2</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-2 py-1.5 font-bold text-slate-800">-27</td>
                                <td className="border border-slate-300 px-2 py-1.5 text-slate-600">-0.07</td>
                                <td className="border border-slate-300 px-2 py-1.5 font-bold text-blue-600">2</td>
                             </tr>
                             <tr className="text-center hover:bg-slate-50">
                                <td className="border border-slate-300 px-2 py-1.5">初三</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">-2</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-2 py-1.5 font-bold text-slate-800">-2</td>
                                <td className="border border-slate-300 px-2 py-1.5 text-slate-600">-0.01</td>
                                <td className="border border-slate-300 px-2 py-1.5 font-bold text-blue-600">1</td>
                             </tr>
                             <tr className="text-center hover:bg-slate-50">
                                <td className="border border-slate-300 px-2 py-1.5">高一</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">-25</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">-5</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-1 py-1.5 text-slate-600">0</td>
                                <td className="border border-slate-300 px-2 py-1.5 font-bold text-slate-800">-30</td>
                                <td className="border border-slate-300 px-2 py-1.5 text-slate-600">-0.09</td>
                                <td className="border border-slate-300 px-2 py-1.5 font-bold text-blue-600">3</td>
                             </tr>
                        </tbody>
                    </table>
                 </div>
            </div>

            {/* Analysis Input */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 border-l-4 border-blue-500 pl-3">五育分析评价</h3>
                
                <div className="flex space-x-4 border-b border-slate-200 pb-2">
                     {['德育', '智育', '体育', '美育', '劳育'].map((tab, idx) => (
                        <button key={tab} className={`text-sm font-medium pb-2 ${idx === 0 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                            {tab}
                        </button>
                     ))}
                </div>

                <div className="relative">
                    <textarea 
                        className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="请输入德育方面的分析评价..."
                    ></textarea>
                    <div className="absolute bottom-2 right-2 text-xs text-slate-400">提示：最多输入2000字</div>
                </div>

                <div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">保存德育评价</button>
                </div>
            </div>
        </div>
    );
};

// 4. Dorm Report Component
const DormReport: React.FC = () => {
    return (
        <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col space-y-6">
                 <h2 className="text-xl font-bold text-center text-slate-800">宿舍量化表</h2>
                 
                 <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center space-x-2">
                              <span className="text-sm text-slate-600">时间:</span>
                              <input type="date" className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500" defaultValue="2025-12-03"/>
                              <span className="text-slate-400">-</span>
                              <input type="date" className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500" defaultValue="2025-12-03"/>
                          </div>
                          <div className="flex items-center space-x-2">
                              <span className="text-sm text-slate-600">学校:</span>
                              <select className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                  <option>长水实验中学杨凌校区</option>
                              </select>
                          </div>
                          <div className="flex items-center space-x-2">
                              <span className="text-sm text-slate-600">年级:</span>
                              <select className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                  <option>请选择年级</option>
                                  <option>初一</option>
                                  <option>初二</option>
                              </select>
                          </div>
                          <div className="flex items-center space-x-2">
                              <span className="text-sm text-slate-600">班级:</span>
                              <select className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                  <option>请选择班级</option>
                              </select>
                          </div>
                      </div>
                      <div className="flex space-x-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">查询</button>
                          <button className="px-4 py-2 border border-slate-300 rounded text-sm hover:bg-slate-50">重置</button>
                          <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">导出Excel</button>
                          <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">详情页</button>
                      </div>
                 </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                <div className="min-w-[1200px] p-4">
                     <table className="w-full border-collapse border border-slate-300 text-xs">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="border border-slate-300 px-2 py-2 font-medium">年级</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium">班级</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium">班主任</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium">男生内务</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium">女生内务</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium">内务</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium">男生午晚休</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium">女生午晚休</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium">午晚休</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium">总扣分</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium">班级人数</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium">人均扣分</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium">排名</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium">综合得分</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium">年级人均扣分</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium">年级排名</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Grade 1 */}
                            {DORM_QUANTITATIVE_DATA.filter(r => r.grade === '初一').map((row, idx, arr) => (
                                <tr key={`g1-${idx}`} className="text-center hover:bg-slate-50">
                                    {idx === 0 && <td rowSpan={arr.length} className="border border-slate-300 px-2 py-2 bg-white">{row.grade}</td>}
                                    <td className="border border-slate-300 px-2 py-2">{row.class}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.headTeacher}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.mContent}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.fContent}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.content}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.mNap}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.fNap}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.nap}</td>
                                    <td className="border border-slate-300 px-2 py-2 font-bold">{row.totalDed}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.count}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.perCapita}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.rank}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.score}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.gradePerCapita}</td>
                                    {idx === 0 && <td rowSpan={arr.length} className="border border-slate-300 px-2 py-2 font-bold bg-white">{row.gradeRank}</td>}
                                </tr>
                            ))}
                            {/* Grade 2 */}
                            {DORM_QUANTITATIVE_DATA.filter(r => r.grade === '初二').map((row, idx, arr) => (
                                <tr key={`g2-${idx}`} className="text-center hover:bg-slate-50">
                                    {idx === 0 && <td rowSpan={arr.length} className="border border-slate-300 px-2 py-2 bg-white">{row.grade}</td>}
                                    <td className="border border-slate-300 px-2 py-2">{row.class}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.headTeacher}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.mContent}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.fContent}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.content}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.mNap}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.fNap}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.nap}</td>
                                    <td className="border border-slate-300 px-2 py-2 font-bold">{row.totalDed}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.count}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.perCapita}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.rank}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.score}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.gradePerCapita}</td>
                                    {idx === 0 && <td rowSpan={arr.length} className="border border-slate-300 px-2 py-2 font-bold bg-white">{row.gradeRank}</td>}
                                </tr>
                            ))}
                             {/* Grade 3 */}
                            {DORM_QUANTITATIVE_DATA.filter(r => r.grade === '初三').map((row, idx, arr) => (
                                <tr key={`g3-${idx}`} className="text-center hover:bg-slate-50">
                                    {idx === 0 && <td rowSpan={arr.length} className="border border-slate-300 px-2 py-2 bg-white">{row.grade}</td>}
                                    <td className="border border-slate-300 px-2 py-2">{row.class}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.headTeacher}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.mContent}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.fContent}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.content}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.mNap}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.fNap}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-slate-600">{row.nap}</td>
                                    <td className="border border-slate-300 px-2 py-2 font-bold">{row.totalDed}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.count}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.perCapita}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.rank}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.score}</td>
                                    <td className="border border-slate-300 px-2 py-2">{row.gradePerCapita}</td>
                                    {idx === 0 && <td rowSpan={arr.length} className="border border-slate-300 px-2 py-2 font-bold bg-white">{row.gradeRank}</td>}
                                </tr>
                            ))}
                        </tbody>
                     </table>
                </div>
            </div>
        </div>
    );
};

// 5. District Report Component
const DistrictReport: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col space-y-6">
                 <h2 className="text-xl font-bold text-center text-slate-800">陕西公司 五育量化表</h2>
                 
                 <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center space-x-2">
                              <span className="text-sm text-slate-600">时间范围:</span>
                              <input type="date" className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500" defaultValue="2025-12-03"/>
                              <span className="text-slate-400">-</span>
                              <input type="date" className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500" defaultValue="2025-12-03"/>
                          </div>
                          <div className="flex items-center space-x-2">
                              <span className="text-sm text-slate-600">省公司:</span>
                              <select className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                  <option>陕西公司</option>
                              </select>
                          </div>
                          <div className="flex items-center space-x-2">
                              <span className="text-sm text-slate-600">学校:</span>
                              <select className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                  <option>长水实验中学杨凌校区</option>
                              </select>
                          </div>
                      </div>
                      <div className="flex space-x-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">查询</button>
                          <button className="px-4 py-2 border border-slate-300 rounded text-sm hover:bg-slate-50">重置</button>
                          <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">导出Excel</button>
                          <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">详情页</button>
                      </div>
                 </div>
            </div>

            {/* District Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                 <div className="min-w-[1200px] p-4">
                    <div className="text-center font-bold text-slate-800 mb-2">长水教育集团陕西公司五育量化表</div>
                    <div className="text-right text-xs text-slate-500 mb-2">部门: 陕西公司 &nbsp;&nbsp; 日期: 2025-12-03</div>
                    
                    <table className="w-full border-collapse border border-slate-300 text-xs">
                        <thead className="bg-slate-50">
                            <tr>
                                <th rowSpan={2} className="border border-slate-300 px-2 py-1">学校</th>
                                <th colSpan={8} className="border border-slate-300 px-2 py-1 bg-blue-50">德育</th>
                                <th colSpan={3} className="border border-slate-300 px-2 py-1 bg-green-50">智育</th>
                                <th colSpan={2} className="border border-slate-300 px-2 py-1 bg-yellow-50">体育</th>
                                <th colSpan={6} className="border border-slate-300 px-2 py-1 bg-purple-50">美育</th>
                                <th colSpan={4} className="border border-slate-300 px-2 py-1 bg-orange-50">劳育</th>
                                <th rowSpan={2} className="border border-slate-300 px-2 py-1">综合扣分</th>
                                <th rowSpan={2} className="border border-slate-300 px-2 py-1">人均扣分</th>
                                <th rowSpan={2} className="border border-slate-300 px-2 py-1">学校排名</th>
                            </tr>
                            <tr>
                                <th className="border border-slate-300 px-1 py-1 font-normal">思政教育</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">课堂纪律</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">课间纪律</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">就餐纪律</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">午休晚休</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">文明礼貌</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">公物维护</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">迟到早退</th>
                                
                                <th className="border border-slate-300 px-1 py-1 font-normal">激情早读</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">激情课堂</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">自习纪律</th>
                                
                                <th className="border border-slate-300 px-1 py-1 font-normal">见习生</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">激情跑操</th>
                                
                                <th className="border border-slate-300 px-1 py-1 font-normal">眼保健操</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">仪容仪表</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">教室用电</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">激情宣誓</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">文化建设</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">每日一歌</th>
                                
                                <th className="border border-slate-300 px-1 py-1 font-normal">教室卫生</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">寝室内务</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">区域卫生</th>
                                <th className="border border-slate-300 px-1 py-1 font-normal">晨检</th>
                            </tr>
                        </thead>
                        <tbody>
                             {DISTRICT_QUANTITATIVE_DATA.map((row, idx) => (
                                <tr key={idx} className="text-center hover:bg-slate-50">
                                    <td className="border border-slate-300 px-2 py-1.5">{row.school}</td>
                                    
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.moral}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.classDisc}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.breakDisc}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.dining}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.dorm}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.politeness}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.property}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.late}</td>
                                    
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.passionRead}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.passionClass}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.selfDisc}</td>
                                    
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.intern}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.run}</td>
                                    
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.eyeHealth}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.appearance}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.electric}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.passionOath}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.culture}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.song}</td>
                                    
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.classHygiene}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.dormHygiene}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.areaHygiene}</td>
                                    <td className="border border-slate-300 px-1 py-1.5 text-slate-600">{row.morningCheck}</td>
                                    
                                    <td className="border border-slate-300 px-2 py-1.5 font-bold text-slate-800">{row.totalDed}</td>
                                    <td className="border border-slate-300 px-2 py-1.5 text-slate-600">{row.perCapita}</td>
                                    <td className="border border-slate-300 px-2 py-1.5 font-bold text-blue-600">{row.rank}</td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                 </div>
            </div>

            {/* Analysis Input */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 border-l-4 border-blue-500 pl-3">五育分析评价</h3>
                
                <div className="flex space-x-4 border-b border-slate-200 pb-2">
                     {['德育', '智育', '体育', '美育', '劳育'].map((tab, idx) => (
                        <button key={tab} className={`text-sm font-medium pb-2 ${idx === 0 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                            {tab}
                        </button>
                     ))}
                </div>

                <div className="relative">
                    <textarea 
                        className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="请输入德育方面的分析评价..."
                    ></textarea>
                    <div className="absolute bottom-2 right-2 text-xs text-slate-400">提示：最多输入2000字</div>
                </div>

                <div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">保存德育评价</button>
                </div>
            </div>
        </div>
    );
};

export default MoralEducation;
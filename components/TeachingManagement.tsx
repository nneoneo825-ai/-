
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
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { Download, Filter, Search, Calendar, ChevronDown, X, ArrowLeft } from 'lucide-react';

// --- Types ---
interface TeacherMetric {
    id: string;
    group: string;
    name: string;
    // Metrics
    design: number; // 教学设计
    quality: number; // 教研质量
    guide: number; // 导纲制作
    exercise: number; // 习题组编
    process: number; // 授课过程
    selfStudy: number; // 学科自习
    marking: number; // 习题批阅
    posting: number; // 成绩贴评
    progress: number; // 教学进度
    listening: number; // 听课评课
    tutoring: number; // 辅导督促
    officeDisc: number; // 办公纪律
    praise: number; // 赞美激励
    hygiene: number; // 卫生摆摆
    check: number; // 查课管理
    board: number; // 板书设计
    oral: number; // 英语口语
    team: number; // 小组建设
    // Summary
    personalScore: number;
    personalRank: number;
    subjectScore: number;
    subjectRank: number;
}

interface SchoolTeachingMetric {
    grade: string;
    design: number;
    quality: number;
    guide: number;
    exercise: number;
    process: number;
    selfStudy: number;
    marking: number;
    posting: number;
    progress: number;
    listening: number;
    tutoring: number;
    officeDisc: number;
    praise: number;
    hygiene: number;
    check: number;
    board: number;
    oral: number;
    team: number;
    gradeScore: number;
    gradeRank: number;
}

interface ProvincialTeachingMetric {
    id: string;
    schoolName: string;
    design: number;
    quality: number;
    guide: number;
    exercise: number;
    process: number;
    selfStudy: number;
    marking: number;
    posting: number;
    progress: number;
    listening: number;
    tutoring: number;
    officeDisc: number;
    praise: number;
    hygiene: number;
    check: number;
    board: number;
    oral: number;
    team: number;
    schoolScore: number;
    schoolRank: number;
}

interface TeachingDetailRecord {
  id: number;
  group: string;
  checkItem: string;
  content: string;
  type: '加分' | '减分';
  score: number;
  time: string;
}

interface GradeTeachingDetailRecord {
  id: number;
  group: string;
  teacher: string;
  checkItem: string;
  content: string;
  type: '加分' | '减分';
  score: number;
  time: string;
}

interface SchoolTeachingDetailRecord {
  id: number;
  grade: string;
  group: string;
  teacher: string;
  checkItem: string;
  content: string;
  type: '加分' | '减分';
  score: number;
  time: string;
}

interface ProvincialTeachingDetailRecord {
  id: number;
  school: string;
  grade: string;
  group: string;
  teacher: string;
  checkItem: string;
  content: string; // 扣分项/Description
  type: '加分' | '减分';
  score: number;
  time: string;
}

// --- Mock Data ---

const TEACHER_PERFORMANCE = [
  { name: '陈老师', studentScore: 92, peerScore: 88, adminScore: 90 },
  { name: '林老师', studentScore: 95, peerScore: 92, adminScore: 94 },
  { name: '黄老师', studentScore: 88, peerScore: 85, adminScore: 87 },
  { name: '周老师', studentScore: 90, peerScore: 90, adminScore: 91 },
  { name: '吴老师', studentScore: 96, peerScore: 94, adminScore: 95 },
];

const PERSONAL_DETAIL_DATA = [
    { id: 1, item: '教学设计', content: '流程不完整; 环节设计简单; 目标不具体; 教学法无问题链及解决物; 教学流程无设计意图; 未交', score: 0, reason: '-' },
    { id: 2, item: '教研质量', content: '迟到早退; 发言无手卡; 教研假大空; 资料未带或准备不齐; 教研记录表未交', score: 0, reason: '-' },
    { id: 3, item: '导纲制作', content: '学习目标不科学; 导学流程和学习目标没有一一对应; 整体的格式有问题; 未交', score: 0, reason: '-' },
    { id: 4, item: '习题组编', content: '题量小; 难度大或难度小; 资料未带或准备不齐; 未交', score: 0, reason: '-' },
    { id: 5, item: '授课过程', content: '导入时间过长; 老师讲授有照本宣科念学生名字出现的问题; 没老师巡视有组织学生高效讨论; 及时纠正学生的不良行为; 讲不精讲, 激情度不够, 激励学生不到位; 缺没有教材或课堂空环节; 教师形象参差不齐; 学生坐姿情况(睡觉, 吵闹); 学生没有按老师要求正课朗读平板', score: 0, reason: '-' },
    { id: 6, item: '学科自习', content: '自习任务安排不合理, 要求学生有分层; 对学生没有巡查到位; 学生玩游戏不听讲, 发呆, 睡觉, 小动作多等; 教师没有及时管理; 老师坐在教室, 没有在讲台准备', score: 0, reason: '-' },
];

const MOCK_TEACHING_DETAILS: TeachingDetailRecord[] = [
  { id: 1, group: '数学', checkItem: '赞美激励', content: '课堂教学中教师对学生赞美激励', type: '加分', score: 3, time: '2025-11-26 20:48:54' },
  { id: 2, group: '数学', checkItem: '赞美激励', content: '课堂教学中教师对学生赞美激励', type: '加分', score: 3, time: '2025-11-26 20:48:53' },
  { id: 3, group: '数学', checkItem: '授课过程', content: '学生违纪情况 (睡觉、吵闹)', type: '减分', score: 3, time: '2025-11-26 20:45:07' },
  { id: 4, group: '数学', checkItem: '学科自习', content: '学生自习状态不佳，如睡觉、发呆、小动作多等', type: '减分', score: 3, time: '2025-11-17 19:36:01' },
  { id: 5, group: '数学', checkItem: '授课过程', content: '学生违纪情况 (睡觉、吵闹)', type: '减分', score: 3, time: '2025-11-17 19:36:01' },
];

const MOCK_GRADE_TEACHING_DETAILS: GradeTeachingDetailRecord[] = [
  { id: 1, group: '数学', teacher: '陈泽沛', checkItem: '学科自习', content: '限时习题的题量不够', type: '减分', score: 3, time: '2025-11-26 20:50:55' },
  { id: 2, group: '历史', teacher: '党元春', checkItem: '赞美激励', content: '课堂教学中教师对学生赞美激励', type: '加分', score: 3, time: '2025-11-26 20:50:27' },
  { id: 3, group: '历史', teacher: '张玉芳', checkItem: '赞美激励', content: '课堂教学中教师对学生赞美激励', type: '加分', score: 3, time: '2025-11-26 20:50:27' },
  { id: 4, group: '政治', teacher: '侯宇鑫', checkItem: '赞美激励', content: '课堂教学中教师对学生赞美激励', type: '加分', score: 3, time: '2025-11-26 20:50:13' },
  { id: 5, group: '政治', teacher: '滑雨晴', checkItem: '赞美激励', content: '课堂教学中教师对学生赞美激励', type: '加分', score: 3, time: '2025-11-26 20:50:13' },
  { id: 6, group: '地理', teacher: '张嘉璇', checkItem: '赞美激励', content: '课堂教学中教师对学生赞美激励', type: '加分', score: 3, time: '2025-11-26 20:49:59' },
  { id: 7, group: '地理', teacher: '郭白雪', checkItem: '赞美激励', content: '课堂教学中教师对学生赞美激励', type: '加分', score: 3, time: '2025-11-26 20:49:59' },
  { id: 8, group: '物理', teacher: '李少伟', checkItem: '赞美激励', content: '课堂教学中教师对学生赞美激励', type: '加分', score: 3, time: '2025-11-26 20:49:20' },
  { id: 9, group: '物理', teacher: '薛力', checkItem: '赞美激励', content: '课堂教学中教师对学生赞美激励', type: '加分', score: 3, time: '2025-11-26 20:49:20' },
  { id: 10, group: '物理', teacher: '席雅秀', checkItem: '赞美激励', content: '课堂教学中教师对学生赞美激励', type: '加分', score: 3, time: '2025-11-26 20:49:20' },
];

const MOCK_SCHOOL_TEACHING_DETAILS: SchoolTeachingDetailRecord[] = [
  { id: 1, grade: '高一', group: '英语', teacher: '王会平', checkItem: '授课过程', content: '学生没有按照老师要求正确使用平板', type: '减分', score: 3, time: '2025-11-12 16:06:48' },
];

const MOCK_PROVINCIAL_TEACHING_DETAILS: ProvincialTeachingDetailRecord[] = [
    { id: 1, school: '长水实验中学杨凌校区', grade: '高一', group: '英语', teacher: '王会平', checkItem: '授课过程', content: '学生没有按照老师要求正确使用平板', type: '减分', score: 3, time: '2025-11-12 16:06:48' },
];

const GRADE_REPORT_DATA: TeacherMetric[] = [
    { id: '1', group: '语文', name: '白少桐', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, personalScore: 0, personalRank: 1, subjectScore: 0, subjectRank: 1 },
    { id: '2', group: '语文', name: '翟佳晴', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, personalScore: 0, personalRank: 1, subjectScore: 0, subjectRank: 1 },
    { id: '3', group: '语文', name: '陈怡帆', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, personalScore: 0, personalRank: 1, subjectScore: 0, subjectRank: 1 },
    { id: '4', group: '数学', name: '李思源', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, personalScore: 0, personalRank: 1, subjectScore: 0, subjectRank: 1 },
    { id: '5', group: '数学', name: '杨艳汇', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, personalScore: 0, personalRank: 1, subjectScore: 0, subjectRank: 1 },
    { id: '6', group: '数学', name: '林姿娜', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, personalScore: 0, personalRank: 1, subjectScore: 0, subjectRank: 1 },
    { id: '7', group: '英语', name: '蔡国丽', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, personalScore: 0, personalRank: 1, subjectScore: 0, subjectRank: 1 },
    { id: '8', group: '英语', name: '韩林轩', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, personalScore: 0, personalRank: 1, subjectScore: 0, subjectRank: 1 },
    { id: '9', group: '英语', name: '龙籽蓉', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, personalScore: 0, personalRank: 1, subjectScore: 0, subjectRank: 1 },
    { id: '10', group: '生物', name: '吕宁', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, personalScore: 0, personalRank: 1, subjectScore: 0, subjectRank: 1 },
    { id: '11', group: '生物', name: '张钰析', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, personalScore: 0, personalRank: 1, subjectScore: 0, subjectRank: 1 },
    { id: '12', group: '生物', name: '杨子珊', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, personalScore: 0, personalRank: 1, subjectScore: 0, subjectRank: 1 },
    { id: '13', group: '生物', name: '陈鑫', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, personalScore: 0, personalRank: 1, subjectScore: 0, subjectRank: 1 },
];

const SCHOOL_TEACHING_DATA: SchoolTeachingMetric[] = [
    { grade: '初一', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, gradeScore: 0, gradeRank: 1 },
    { grade: '初二', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, gradeScore: 0, gradeRank: 1 },
    { grade: '初三', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, gradeScore: 0, gradeRank: 1 },
    { grade: '高一', design: 0, quality: 0, guide: 0, exercise: 0, process: -3, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, gradeScore: -3, gradeRank: 2 },
    { grade: '高二', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, gradeScore: 0, gradeRank: 1 },
    { grade: '高三', design: 0, quality: 0, guide: 0, exercise: 0, process: 0, selfStudy: 0, marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, gradeScore: 0, gradeRank: 1 },
];

const PROVINCIAL_TEACHING_DATA: ProvincialTeachingMetric[] = [
    { 
        id: '1', 
        schoolName: '长水实验中学杨凌校区', 
        design: 0, quality: 0, guide: 0, exercise: 0, process: -3, selfStudy: 0, 
        marking: 0, posting: 0, progress: 0, listening: 0, tutoring: 0, 
        officeDisc: 0, praise: 0, hygiene: 0, check: 0, board: 0, oral: 0, team: 0, 
        schoolScore: -3, schoolRank: 1 
    },
];

// --- Components ---

const TeachingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'grade' | 'school' | 'provincial'>('school');

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
          <h1 className="text-2xl font-bold text-slate-900">教学评价管理 (Teaching Evaluation)</h1>
          <p className="text-slate-500 mt-1">教师教学质量综合评估报表。</p>
        </div>
      </div>

       {/* Tab Navigation */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-2 shadow-sm overflow-x-auto">
        <div className="flex space-x-2">
          {renderTabButton('personal', '个人报表')}
          {renderTabButton('grade', '年级报表')}
          {renderTabButton('school', '校级报表')}
          {renderTabButton('provincial', '省公司报表')}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === 'personal' && <TeachingPersonalReport />}
        {activeTab === 'grade' && <TeachingGradeReport />}
        {activeTab === 'school' && <TeachingSchoolReport />}
        {activeTab === 'provincial' && <TeachingProvincialReport />}
      </div>
    </div>
  );
};

const TeachingPersonalReport: React.FC = () => {
    const [view, setView] = useState<'summary' | 'detail'>('summary');

    if (view === 'detail') {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex-1"></div>
                    <h2 className="text-2xl font-bold text-slate-900 text-center flex-1 whitespace-nowrap">个人教学量化详情</h2>
                    <div className="flex-1 flex justify-end space-x-3">
                         <button 
                            onClick={() => setView('summary')}
                            className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center"
                         >
                             返回
                         </button>
                         <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center">
                             导出
                         </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">教研组</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">检查项</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider w-1/3">扣分项</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">加分/减分</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">分数</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">时间</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {MOCK_TEACHING_DETAILS.map((record) => (
                                <tr key={record.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.group}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.checkItem}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-600">{record.content}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-600">{record.type}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.score}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-500">{record.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-center space-x-2 text-sm text-slate-600">
                       <span>共 {MOCK_TEACHING_DETAILS.length} 条</span>
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
                <h2 className="text-xl font-bold text-center text-slate-800">白少桐 教师个人量化考核报表</h2>
                <p className="text-center text-xs text-slate-500">基于教学量化考核明细生成</p>

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
                            <span className="text-sm text-slate-600">教研组:</span>
                            <select className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option>语文</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-600">老师:</span>
                             <div className="relative">
                                <input type="text" className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 w-32 pl-2" defaultValue="白少桐"/>
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <span className="text-xs">✕</span>
                                </button>
                             </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-600">项目:</span>
                            <select className="text-sm border-slate-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option>全部项目</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">查询</button>
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
                <div className="flex items-center space-x-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">白少桐</h1>
                        <div className="flex space-x-2 mt-2">
                            <span className="px-2 py-0.5 rounded border border-slate-300 text-xs text-slate-600 bg-slate-50">初中语文</span>
                            <span className="px-2 py-0.5 rounded border border-slate-300 text-xs text-slate-600 bg-slate-50">初一-38班</span>
                        </div>
                         <div className="flex space-x-2 mt-1">
                            <span className="px-2 py-0.5 rounded border border-slate-300 text-xs text-slate-600 bg-slate-50">初中语文</span>
                            <span className="px-2 py-0.5 rounded border border-slate-300 text-xs text-slate-600 bg-slate-50">初一-40班</span>
                        </div>
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
                        <div className="text-3xl font-bold text-green-500">0</div>
                        <span className="text-xs text-slate-400">基础分0分</span>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-sm text-green-700 mb-1">加分项</span>
                    <span className="text-2xl font-bold text-green-600">+0</span>
                </div>
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-sm text-red-700 mb-1">扣分项</span>
                    <span className="text-2xl font-bold text-red-600">-0</span>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-sm text-blue-700 mb-1">检查项目</span>
                    <span className="text-2xl font-bold text-blue-600">0</span>
                </div>
                <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-sm text-purple-700 mb-1">排名</span>
                    <span className="text-2xl font-bold text-purple-600">9</span>
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-32">扣分原因</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {PERSONAL_DETAIL_DATA.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-sm text-slate-500">{row.id}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-800">{row.item}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    <ul className="list-disc list-inside space-y-1 text-xs">
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
                                                className={`h-full ${row.score < 0 ? 'bg-red-500' : 'bg-yellow-400'}`}
                                                style={{ width: `${Math.min(Math.abs(row.score || 50), 100)}%` }} // Mock progress for 0 score
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-500">
                                    {row.reason}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const TeachingGradeReport: React.FC = () => {
    const [view, setView] = useState<'summary' | 'detail'>('summary');

    if (view === 'detail') {
        return (
             <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex-1"></div>
                    <h2 className="text-2xl font-bold text-slate-900 text-center flex-1 whitespace-nowrap">高一 年级教学量化详情</h2>
                    <div className="flex-1 flex justify-end space-x-3">
                         <button 
                            onClick={() => setView('summary')}
                            className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center"
                         >
                             返回
                         </button>
                         <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center">
                             导出
                         </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">教研组</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">老师</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">检查项</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider w-1/3">扣分项</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">加分/减分</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">分数</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">时间</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {MOCK_GRADE_TEACHING_DETAILS.map((record) => (
                                <tr key={record.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.group}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.teacher}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.checkItem}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-600">{record.content}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-600">{record.type}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.score}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-500">{record.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-center space-x-2 text-sm text-slate-600">
                       <span>共 50 条</span>
                       <select className="border-slate-300 rounded text-sm py-1 focus:ring-blue-500 focus:border-blue-500 outline-none">
                           <option>10条/页</option>
                       </select>
                       <button className="px-2 py-1 text-slate-400 hover:text-blue-600">&lt;</button>
                       <button className="px-2 py-1 text-blue-600 font-bold">1</button>
                       <button className="px-2 py-1 text-slate-400 hover:text-blue-600">2</button>
                       <button className="px-2 py-1 text-slate-400 hover:text-blue-600">3</button>
                       <button className="px-2 py-1 text-slate-400 hover:text-blue-600">4</button>
                       <button className="px-2 py-1 text-slate-400 hover:text-blue-600">5</button>
                       <button className="px-2 py-1 text-slate-400 hover:text-blue-600">&gt;</button>
                       <span>前往</span>
                       <input type="text" defaultValue="1" className="w-10 border border-slate-300 rounded text-center py-1 focus:ring-blue-500 focus:border-blue-500 outline-none"/>
                       <span>页</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col space-y-6">
                 <h2 className="text-xl font-bold text-center text-slate-800">初一 年级教学量化表</h2>
                 
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
                          <button 
                             onClick={() => setView('detail')}
                             className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                          >
                             详情页
                          </button>
                      </div>
                 </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                 <div className="min-w-[1500px] p-4">
                    <div className="text-center font-bold text-slate-800 mb-2">长水教育集团长水实验中学杨凌校区初一年级部教学量化表</div>
                    <div className="text-right text-xs text-slate-500 mb-2">年级: 初一年级部 &nbsp;&nbsp; 日期: 2025-12-03</div>
                    
                    <table className="w-full border-collapse border border-slate-300 text-xs">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="border border-slate-300 px-2 py-2 font-medium bg-slate-100 text-slate-600">教研组</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium bg-slate-100 text-slate-600">姓名</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">教学设计</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">教研质量</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">导纲制作</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">习题组编</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">授课过程</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">学科自习</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">习题批阅</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">成绩贴评</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">教学进度</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">听课评课</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">辅导督促</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">办公纪律</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">赞美激励</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">卫生物理</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">查课管理</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">板书设计</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">英语口语</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">小组建设</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium bg-slate-50 text-slate-800">个人得分</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium bg-slate-50 text-slate-800">个人排名</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium bg-slate-50 text-slate-800">学科得分</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium bg-slate-50 text-slate-800">学科排名</th>
                            </tr>
                        </thead>
                        <tbody>
                             {['语文', '数学', '英语', '生物'].map(subject => {
                                 const teachers = GRADE_REPORT_DATA.filter(t => t.group === subject);
                                 return teachers.map((teacher, idx) => (
                                     <tr key={teacher.id} className="text-center hover:bg-slate-50">
                                         {idx === 0 && (
                                             <td rowSpan={teachers.length} className="border border-slate-300 px-2 py-2 bg-white font-medium text-slate-700">
                                                 {teacher.group}
                                             </td>
                                         )}
                                         <td className="border border-slate-300 px-2 py-2 text-slate-800">{teacher.name}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.design}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.quality}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.guide}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.exercise}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.process}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.selfStudy}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.marking}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.posting}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.progress}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.listening}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.tutoring}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.officeDisc}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.praise}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.hygiene}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.check}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.board}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.oral}</td>
                                         <td className="border border-slate-300 px-1 py-2 text-slate-600">{teacher.team}</td>
                                         <td className="border border-slate-300 px-2 py-2 text-slate-800">{teacher.personalScore}</td>
                                         <td className="border border-slate-300 px-2 py-2 text-slate-800">{teacher.personalRank}</td>
                                         {idx === 0 && (
                                              <td rowSpan={teachers.length} className="border border-slate-300 px-2 py-2 bg-white text-slate-600">
                                                  {teacher.subjectScore}
                                              </td>
                                         )}
                                          {idx === 0 && (
                                              <td rowSpan={teachers.length} className="border border-slate-300 px-2 py-2 bg-white text-slate-600">
                                                  {teacher.subjectRank}
                                              </td>
                                         )}
                                     </tr>
                                 ));
                             })}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};

const TeachingSchoolReport: React.FC = () => {
    const [view, setView] = useState<'summary' | 'detail'>('summary');

    if (view === 'detail') {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex-1"></div>
                    <h2 className="text-2xl font-bold text-slate-900 text-center flex-1 whitespace-nowrap">长水实验中学杨凌校区 校级教学量化详情</h2>
                    <div className="flex-1 flex justify-end space-x-3">
                         <button 
                            onClick={() => setView('summary')}
                            className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center"
                         >
                             返回
                         </button>
                         <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center">
                             导出
                         </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">年级</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">教研组</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">老师</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">检查项</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider w-1/3">扣分项</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">加分/减分</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">分数</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">时间</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {MOCK_SCHOOL_TEACHING_DETAILS.map((record) => (
                                <tr key={record.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.grade}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.group}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.teacher}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.checkItem}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-600">{record.content}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-600">{record.type}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.score}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-500">{record.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-center space-x-2 text-sm text-slate-600">
                       <span>共 {MOCK_SCHOOL_TEACHING_DETAILS.length} 条</span>
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
        )
    }

  return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col space-y-6">
                 <h2 className="text-xl font-bold text-center text-slate-800">长水实验中学杨凌校区 校级教学事务部教学量化表</h2>
                 
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
                          <button 
                             onClick={() => setView('detail')}
                             className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                          >
                             详情页
                          </button>
                      </div>
                 </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                 <div className="min-w-[1500px] p-4">
                    <div className="text-center font-bold text-slate-800 mb-2">长水教育集团长水实验中学杨凌校区教学事务部教学量化表</div>
                    <div className="text-right text-xs text-slate-500 mb-2">部门: 教学事务部 &nbsp;&nbsp; 日期: 2025-12-03</div>
                    
                    <table className="w-full border-collapse border border-slate-300 text-xs">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="border border-slate-300 px-2 py-2 font-medium bg-slate-100 text-slate-600">年级</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">教学设计</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">教研质量</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">导纲制作</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">习题组编</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">授课过程</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">学科自习</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">习题批阅</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">成绩贴评</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">教学进度</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">听课评课</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">辅导督促</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">办公纪律</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">赞美激励</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">卫生物理</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">查课管理</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">板书设计</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">英语口语</th>
                                <th className="border border-slate-300 px-1 py-2 font-medium text-slate-600">小组建设</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium bg-slate-50 text-slate-800">年级得分</th>
                                <th className="border border-slate-300 px-2 py-2 font-medium bg-slate-50 text-slate-800">年级排名</th>
                            </tr>
                        </thead>
                        <tbody>
                             {SCHOOL_TEACHING_DATA.map((row, idx) => (
                                 <tr key={idx} className="text-center hover:bg-slate-50">
                                     <td className="border border-slate-300 px-2 py-2 font-medium text-slate-800">{row.grade}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.design}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.quality}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.guide}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.exercise}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.process}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.selfStudy}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.marking}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.posting}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.progress}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.listening}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.tutoring}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.officeDisc}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.praise}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.hygiene}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.check}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.board}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.oral}</td>
                                     <td className="border border-slate-300 px-1 py-2 text-slate-600">{row.team}</td>
                                     <td className="border border-slate-300 px-2 py-2 text-slate-800 font-bold">{row.gradeScore}</td>
                                     <td className="border border-slate-300 px-2 py-2 text-blue-600 font-bold">{row.gradeRank}</td>
                                 </tr>
                             ))}
                        </tbody>
                    </table>
                 </div>
            </div>

             {/* Analysis Input */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 border-l-4 border-blue-500 pl-3">分析评价</h3>
                
                <div className="relative">
                    <textarea 
                        className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="请输入分析评价内容..."
                    ></textarea>
                    <div className="absolute bottom-2 right-2 text-xs text-slate-400">提示：最多输入2000字</div>
                </div>

                <div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">保存分析评价</button>
                </div>
            </div>
        </div>
  );
};

const TeachingProvincialReport: React.FC = () => {
    const [view, setView] = useState<'summary' | 'detail'>('summary');

    if (view === 'detail') {
        return (
             <div className="space-y-6">
                 {/* Header */}
                <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex-1"></div>
                    <h2 className="text-2xl font-bold text-slate-900 text-center flex-1 whitespace-nowrap">陕西公司 教学事务部教学量化详情</h2>
                    <div className="flex-1 flex justify-end space-x-3">
                         <button 
                            onClick={() => setView('summary')}
                            className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center"
                         >
                             返回
                         </button>
                         <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center">
                             导出
                         </button>
                    </div>
                </div>

                {/* Detail Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">学校</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">年级</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">教研组</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">老师</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">检查项</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider w-1/3">扣分项</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">加分/减分</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">分数</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">时间</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {MOCK_PROVINCIAL_TEACHING_DETAILS.map((record) => (
                                <tr key={record.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.school}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.grade}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.group}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.teacher}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.checkItem}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-600">{record.content}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-600">{record.type}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-900">{record.score}</td>
                                    <td className="px-6 py-4 text-sm text-center text-slate-500">{record.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-center space-x-2 text-sm text-slate-600">
                       <span>共 {MOCK_PROVINCIAL_TEACHING_DETAILS.length} 条</span>
                       <select className="border-slate-300 rounded text-sm py-1 focus:ring-blue-500 focus:border-blue-500 outline-none">
                           <option>20条/页</option>
                       </select>
                       <button className="px-2 py-1 text-slate-400 hover:text-blue-600">&lt;</button>
                       <button className="px-2 py-1 text-blue-600 font-bold">1</button>
                       <button className="px-2 py-1 text-slate-400 hover:text-blue-600">&gt;</button>
                       <span>前往</span>
                       <input type="text" defaultValue="1" className="w-10 border border-slate-300 rounded text-center py-1 focus:ring-blue-500 focus:border-blue-500 outline-none"/>
                       <span>页</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
             <div className="text-center py-4">
                 <h2 className="text-2xl font-bold text-slate-900">陕西公司 教学事务部教学量化表</h2>
             </div>

             {/* Filter Bar */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center space-x-2">
                             <span className="text-sm font-medium text-slate-600">时间范围</span>
                             <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white">
                                 <span className="pl-3 py-2 bg-slate-50 border-r border-slate-200">
                                     <Calendar size={16} className="text-slate-500"/>
                                 </span>
                                 <input type="date" className="py-2 px-3 text-sm focus:outline-none bg-transparent" defaultValue="2025-11-01"/>
                                 <span className="px-2 text-slate-400 text-sm">至</span>
                                 <input type="date" className="py-2 px-3 text-sm focus:outline-none bg-transparent" defaultValue="2025-11-30"/>
                             </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-slate-600">省公司</span>
                            <select className="py-2 px-3 border border-slate-300 rounded-md text-sm min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                <option>陕西公司</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-slate-600">学校</span>
                            <div className="relative">
                                <select className="py-2 pl-3 pr-8 border border-slate-300 rounded-md text-sm min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-slate-700">
                                    <option>长水实验中学杨凌校区</option>
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <ChevronDown size={14} className="text-slate-400"/>
                                </div>
                                <button className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                     <X size={12} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                         <button className="px-5 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors">查询</button>
                         <button className="px-5 py-2 border border-slate-300 bg-white text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">重置</button>
                         <button className="px-5 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors">导出Excel</button>
                         <button onClick={() => setView('detail')} className="px-5 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors">详情页</button>
                    </div>
                </div>
             </div>

             {/* Table */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                     <div className="text-sm font-medium text-slate-700 mx-auto">长水教育集团陕西公司教学事务部教学量化表</div>
                     <div className="text-xs text-slate-500 absolute right-6">
                         <span className="mr-4">部门: 教学事务部</span>
                         <span>日期: 2025-12-06</span>
                     </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-slate-200 text-center text-xs">
                        <thead className="bg-slate-50 text-slate-600">
                             <tr>
                                 <th className="border border-slate-200 px-3 py-3 font-medium bg-slate-50 min-w-[150px]">学校</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">教学设计</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">教研质量</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">导纲制作</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">习题组编</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">授课过程</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">学科自习</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">习题批阅</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">成绩贴评</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">教学进度</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">听课评课</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">辅导督促</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">办公纪律</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">赞美激励</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">卫生摆摆</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">查课管理</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">板书设计</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">英语口语</th>
                                 <th className="border border-slate-200 px-2 py-3 font-medium">小组建设</th>
                                 <th className="border border-slate-200 px-3 py-3 font-medium bg-slate-50">学校得分</th>
                                 <th className="border border-slate-200 px-3 py-3 font-medium bg-slate-50">学校排名</th>
                             </tr>
                        </thead>
                        <tbody className="bg-white">
                            {PROVINCIAL_TEACHING_DATA.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50 text-slate-600">
                                    <td className="border border-slate-200 px-3 py-3 text-left font-medium text-slate-800">{row.schoolName}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.design}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.quality}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.guide}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.exercise}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.process}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.selfStudy}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.marking}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.posting}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.progress}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.listening}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.tutoring}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.officeDisc}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.praise}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.hygiene}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.check}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.board}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.oral}</td>
                                    <td className="border border-slate-200 px-2 py-3">{row.team}</td>
                                    <td className="border border-slate-200 px-3 py-3 font-bold text-slate-800">{row.schoolScore}</td>
                                    <td className="border border-slate-200 px-3 py-3 font-bold text-blue-600">{row.schoolRank}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>

             {/* Analysis Section */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                 <h3 className="text-lg font-bold text-slate-800">分析评价</h3>
                 
                 <div className="relative">
                     <textarea 
                        className="w-full h-32 p-4 border border-slate-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 resize-none placeholder-slate-400 bg-white"
                        placeholder="请输入分析评价内容..."
                     ></textarea>
                     <div className="absolute bottom-3 right-3 text-xs text-slate-400">提示: 最多输入2000字</div>
                      <div className="absolute bottom-2 right-2">
                        <div className="h-3 w-3 bg-slate-300 transform rotate-45 translate-x-1.5 translate-y-1.5 cursor-se-resize"></div>
                     </div>
                 </div>

                 <div>
                     <button className="px-6 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm">
                         保存评价
                     </button>
                 </div>
             </div>
        </div>
    )
}

export default TeachingManagement;

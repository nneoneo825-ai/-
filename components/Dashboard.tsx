import React from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { StatCardProps } from '../types';

// Mock Data
const RADAR_DATA = [
  { subject: '德育 (Moral)', A: 100, B: 85, fullMark: 100 },
  { subject: '智育 (Intellect)', A: 100, B: 78, fullMark: 100 },
  { subject: '体育 (Physical)', A: 100, B: 90, fullMark: 100 },
  { subject: '美育 (Artistic)', A: 100, B: 70, fullMark: 100 },
  { subject: '劳育 (Labor)', A: 100, B: 88, fullMark: 100 },
];

const WEEKLY_SCORE_DATA = [
  { name: '周一', 德育分: 98, 教学评分: 95 },
  { name: '周二', 德育分: 96, 教学评分: 93 },
  { name: '周三', 德育分: 94, 教学评分: 96 },
  { name: '周四', 德育分: 97, 教学评分: 94 },
  { name: '周五', 德育分: 99, 教学评分: 97 },
];

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendUp, icon }) => (
  <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
      </div>
      <div className={`rounded-full p-3 ${trendUp ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
        {icon}
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-sm">
        <span className={`font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </span>
        <span className="ml-2 text-slate-400">较上周</span>
      </div>
    )}
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">数据概览 (Dashboard)</h1>
          <p className="text-slate-500 mt-1">欢迎回来，今日校园五育评价数据已更新。</p>
        </div>
        <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center rounded-md bg-green-50 px-3 py-1 text-sm font-medium text-green-700 border border-green-200">
               🟢 系统运行正常
            </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="在校学生总数" 
          value="3,240" 
          trend="2.5%" 
          trendUp={true} 
          icon={<Users size={24} />} 
        />
        <StatCard 
          title="教职工人数" 
          value="218" 
          trend="0%" 
          trendUp={true} 
          icon={<GraduationCap size={24} />} 
        />
        <StatCard 
          title="本周德育平均分" 
          value="96.5" 
          trend="1.2%" 
          trendUp={false} 
          icon={<TrendingUp size={24} />} 
        />
        <StatCard 
          title="本周教学平均分" 
          value="95.2" 
          trend="0.8%" 
          trendUp={true} 
          icon={<BookOpen size={24} />} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Radar Chart for 5-Domain Evaluation */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">全校五育综合评价 (Five-Education)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="校平均分"
                  dataKey="B"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="#3b82f6"
                  fillOpacity={0.4}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line/Bar Chart for Trends */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">本周德育与教学评分趋势</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_SCORE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} domain={[80, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                  cursor={{ fill: '#f8fafc' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="德育分" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="教学评分" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Notifications/Alerts */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">最近预警 (Alerts)</h3>
        <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                <AlertCircle className="text-red-500 mt-0.5" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-red-800">高二(3)班 晚休纪律扣分严重</h4>
                    <p className="text-xs text-red-600 mt-1">2025-11-10 23:30 - 昨晚宿管检查发现305宿舍吵闹。</p>
                </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-yellow-800">教学设备检查提醒</h4>
                    <p className="text-xs text-yellow-700 mt-1">请在周五前完成所有多媒体教室的例行检查。</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
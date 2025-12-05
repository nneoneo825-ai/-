import React, { useState } from 'react';
import { 
  CheckCircle,
  Save,
  Calendar,
  User,
  School
} from 'lucide-react';

const INDICATORS = [
    { id: 1, category: '纪律', name: '上课迟到', score: -2 },
    { id: 2, category: '纪律', name: '课堂玩手机', score: -5 },
    { id: 3, category: '卫生', name: '教室地面有垃圾', score: -1 },
    { id: 4, category: '礼仪', name: '不穿校服', score: -2 },
    { id: 5, category: '表彰', name: '好人好事', score: +2 },
];

const DataCollection: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'moral' | 'teaching'>('moral');
  const [formStatus, setFormStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('saving');
    // Simulate API call
    setTimeout(() => {
        setFormStatus('saved');
        setTimeout(() => setFormStatus('idle'), 2000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">日常数据采集 (Data Collection)</h1>
        <p className="text-slate-500 mt-2">干事/值日老师请在此录入检查数据</p>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
          <button 
            onClick={() => setSelectedType('moral')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${selectedType === 'moral' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'}`}
          >
            德育检查 (Student)
          </button>
          <button 
             onClick={() => setSelectedType('teaching')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${selectedType === 'teaching' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'}`}
          >
            教学检查 (Teacher)
          </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">检查日期</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-slate-400" />
                        </div>
                        <input type="date" className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                    </div>
                </div>

                {/* Scope Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">检查层级</label>
                    <select className="block w-full py-2 px-3 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm">
                        <option>校级检查</option>
                        <option>年级检查</option>
                        <option>宿舍检查</option>
                    </select>
                </div>

                {/* Class/Teacher Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        {selectedType === 'moral' ? '涉及班级/学生' : '涉及教师'}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           {selectedType === 'moral' ? <School className="h-5 w-5 text-slate-400" /> : <User className="h-5 w-5 text-slate-400" />} 
                        </div>
                        <input 
                            type="text" 
                            placeholder={selectedType === 'moral' ? "例如：高一(2)班 或 李明" : "例如：张老师"}
                            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" 
                        />
                    </div>
                </div>

                {/* Indicator Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">评价指标</label>
                    <select className="block w-full py-2 px-3 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm">
                        <option value="">请选择指标...</option>
                        {INDICATORS.map(ind => (
                            <option key={ind.id} value={ind.id}>[{ind.category}] {ind.name} ({ind.score}分)</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">情况说明/备注</label>
                <textarea 
                    rows={4}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-slate-300 rounded-md p-2"
                    placeholder="请详细描述违规或表彰的具体情况..."
                ></textarea>
            </div>

            {/* Image Upload Mock */}
            <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">现场照片 (可选)</label>
                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-slate-600">
                            <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                <span>上传文件</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </span>
                            <p className="pl-1">或拖拽文件到这里</p>
                        </div>
                        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end border-t border-slate-100 pt-6">
                <button type="button" className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3">
                    重置
                </button>
                <button 
                    type="submit" 
                    disabled={formStatus === 'saving' || formStatus === 'saved'}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        formStatus === 'saved' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {formStatus === 'saving' && <span className="animate-spin mr-2">⏳</span>}
                    {formStatus === 'saved' && <CheckCircle className="mr-2 h-4 w-4" />}
                    {formStatus === 'idle' && <Save className="mr-2 h-4 w-4" />}
                    {formStatus === 'idle' ? '提交记录' : formStatus === 'saving' ? '提交中...' : '提交成功'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default DataCollection;
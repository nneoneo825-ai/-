import React from 'react';

export enum Role {
  ADMIN = '管理员',
  PRINCIPAL = '校长',
  TEACHER = '教师',
  STUDENT = '学生',
}

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
}

export interface Student {
  id: string; // Used as Student ID (学号)
  name: string;
  gender: '男' | '女';
  school: string;
  grade: string;
  class: string;
  building?: string;
  floor?: number;
  dorm?: string;
  bedNo?: number;
  createTime?: string;
  score: number; // Keep for compatibility with dashboard
}

export interface Teacher {
  id: string;
  name: string;
  gender: '男' | '女';
  school: string;
  grade: string;
  title: string; // Position/Post e.g., 班主任
  subject: string;
  phone: string;
  rating: number; // Keep for compatibility
}

export interface MenuLink {
  label: string;
  path: string;
  icon: React.ElementType;
}

export interface EvaluationMetric {
  subject: string;
  A: number; // Full mark for metric
  B: number; // Current score
}
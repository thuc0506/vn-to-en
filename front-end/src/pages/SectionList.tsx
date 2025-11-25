import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Clock, ChevronRight, CheckCircle2, Lock, Play, Award, TrendingUp } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useFetchTopicsBySlugAndType } from "../hooks/topic/useFetchTopicsBySlug";

const SectionList = () => { 
    const { slug, courseType } = useParams();
    const { topic, loading } = useFetchTopicsBySlugAndType(slug, courseType);
    const [expandedSections, setExpandedSections] = useState<string[]>([]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (!topic) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy chủ đề</h3>
                    <p className="text-gray-600">Vui lòng kiểm tra lại đường dẫn</p>
                </div>
            </div>
        );
    }

    const totalLessons = topic.sections.reduce((acc, section) => 
        acc + section.lessons.filter(lesson => lesson.type === topic.type).length, 0
    );

    const completedLessons = 0; // TODO: Integrate with progress tracking
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Hero Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-white/20 p-3 rounded-xl">
                                    <BookOpen className="h-8 w-8" />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-1">
                                        {topic.title}
                                    </h1>
                                    <p className="text-blue-100 text-sm">
                                        Khóa học {topic.type === 'translate' ? 'Dịch thuật' : 'Học tập'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-blue-100">Tiến độ học tập</span>
                                    <span className="text-sm font-bold">{completedLessons}/{totalLessons} bài học</span>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="flex gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[100px]">
                                <div className="flex items-center justify-center mb-1">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <p className="text-2xl font-bold">{totalLessons}</p>
                                <p className="text-xs text-blue-100">Bài học</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[100px]">
                                <div className="flex items-center justify-center mb-1">
                                    <Award className="h-5 w-5" />
                                </div>
                                <p className="text-2xl font-bold">{topic.sections.length}</p>
                                <p className="text-xs text-blue-100">Chương</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sections Accordion */}
                <Accordion 
                    type="multiple" 
                    className="space-y-4"
                    value={expandedSections}
                    onValueChange={setExpandedSections}
                >
                    {topic.sections.map((section, sectionIndex) => {
                        const sectionLessons = section.lessons.filter(lesson => lesson.type === topic.type);
                        const sectionCompleted = 0; // TODO: Calculate completed lessons in section
                        const sectionProgress = sectionLessons.length > 0 
                            ? (sectionCompleted / sectionLessons.length) * 100 
                            : 0;

                        return (
                            <AccordionItem
                                key={section.id}
                                value={`section-${section.id}`}
                                className="border-none"
                            >
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
                                    <AccordionTrigger className="px-6 py-5 hover:bg-gray-50 transition-colors [&[data-state=open]]:bg-gradient-to-r [&[data-state=open]]:from-blue-50 [&[data-state=open]]:to-indigo-50">
                                        <div className="flex items-center justify-between w-full pr-4">
                                            <div className="flex items-center gap-4">
                                                {/* Section Number Badge */}
                                                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg rounded-xl w-12 h-12 flex items-center justify-center shadow-md">
                                                    {sectionIndex + 1}
                                                </div>
                                                
                                                <div className="text-left">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                        {section.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <BookOpen className="h-4 w-4" />
                                                            {sectionLessons.length} bài học
                                                        </span>
                                                        {sectionProgress > 0 && (
                                                            <span className="flex items-center gap-1 text-green-600 font-medium">
                                                                <CheckCircle2 className="h-4 w-4" />
                                                                {Math.round(sectionProgress)}% hoàn thành
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent className="bg-gradient-to-br from-gray-50 to-blue-50/30 px-6 py-4">
                                        {sectionLessons.length === 0 ? (
                                            <div className="text-center py-8">
                                                <div className="bg-white rounded-xl p-6 inline-block">
                                                    <Lock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                                    <p className="text-gray-600 font-medium">Chưa có bài học phù hợp</p>
                                                    <p className="text-sm text-gray-500 mt-1">Nội dung đang được cập nhật</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid gap-3">
                                                {sectionLessons.map((lesson, lessonIndex) => {
                                                    const isCompleted = false; // TODO: Check if lesson is completed
                                                    const isLocked = false; // TODO: Check if lesson is locked

                                                    return (
                                                        <Link
                                                            to={`/courses/${courseType}/${slug}/${lesson.slug}.${lesson.id}`}
                                                            key={lesson.id}
                                                            className={`group relative bg-white rounded-xl shadow-sm border-2 transition-all duration-300 overflow-hidden
                                                                ${isLocked 
                                                                    ? 'border-gray-200 opacity-60 cursor-not-allowed' 
                                                                    : 'border-transparent hover:border-blue-400 hover:shadow-lg hover:-translate-y-1'
                                                                }
                                                                ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
                                                        >
                                                            {/* Gradient Overlay on Hover */}
                                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            
                                                            <div className="relative p-4 flex items-center justify-between">
                                                                <div className="flex items-center gap-4 flex-1">
                                                                    {/* Lesson Number */}
                                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm
                                                                        ${isCompleted 
                                                                            ? 'bg-green-500 text-white' 
                                                                            : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700'
                                                                        }`}>
                                                                        {isCompleted ? (
                                                                            <CheckCircle2 className="h-5 w-5" />
                                                                        ) : (
                                                                            lessonIndex + 1
                                                                        )}
                                                                    </div>

                                                                    {/* Lesson Info */}
                                                                    <div className="flex-1">
                                                                        <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                                                            {lesson.title}
                                                                        </h4>
                                                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                                                            <span className="flex items-center gap-1">
                                                                                <Clock className="h-3.5 w-3.5" />
                                                                                {lesson.duration ?? '—'}
                                                                            </span>
                                                                            {isCompleted && (
                                                                                <span className="flex items-center gap-1 text-green-600 font-medium">
                                                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                                                    Đã hoàn thành
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Action Button */}
                                                                <div className="flex items-center gap-2">
                                                                    {isLocked ? (
                                                                        <div className="bg-gray-100 p-2 rounded-lg">
                                                                            <Lock className="h-5 w-5 text-gray-400" />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="bg-blue-100 group-hover:bg-blue-600 p-2 rounded-lg transition-colors">
                                                                            {isCompleted ? (
                                                                                <TrendingUp className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                                                                            ) : (
                                                                                <Play className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                                                </div>
                                                            </div>

                                                            {/* Progress Bar for Completed Lessons */}
                                                            {isCompleted && (
                                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500" />
                                                            )}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </AccordionContent>
                                </div>
                            </AccordionItem>
                        );
                    })}
                </Accordion>

                {/* Footer Stats */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{totalLessons}</p>
                            <p className="text-sm text-gray-600">Tổng số bài học</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{completedLessons}</p>
                            <p className="text-sm text-gray-600">Đã hoàn thành</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{Math.round(progressPercentage)}%</p>
                            <p className="text-sm text-gray-600">Tiến độ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionList;
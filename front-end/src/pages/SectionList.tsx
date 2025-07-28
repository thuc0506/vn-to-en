import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Clock } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useFetchTopicsBySlug } from "../hooks/topic/useFetchTopicsBySlug"; // Adjust the import path as necessary

const SectionList = () => { 
    const { slug } = useParams();
    const { courseType } = useParams();
    const { topic, loading } = useFetchTopicsBySlug(slug || "");


    if (loading) {
        return <div className="py-10 text-center text-muted-foreground">Đang tải dữ liệu...</div>;
    }

    if (!topic) {
        return <div className="py-10 text-center text-red-500">Không tìm thấy chủ đề.</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
                    {topic.title}
                </h1>

                <Accordion type="multiple" className="space-y-4">
                    {topic.sections.map((section) => (
                        <AccordionItem
                            key={section.id}
                            value={`section-${section.id}`}
                            className="border rounded-lg shadow-sm"
                        >
                            <AccordionTrigger className="px-6 py-4 text-left text-lg font-semibold hover:bg-muted/30 transition-colors">
                                {section.title}
                            </AccordionTrigger>

                            <AccordionContent className="bg-muted/10 px-6 py-4 space-y-3">
                                {section.lessons.filter(lesson => lesson.type === topic.type).length === 0 ? (
                                    <div className="text-muted-foreground">Chưa có bài học phù hợp.</div>
                                ) : (
                                    section.lessons
                                        .filter(lesson => lesson.type === topic.type)
                                        .map((lesson) => (
                                            <Link
                                               to={`/courses/${courseType}/${slug}/${lesson.slug}.${lesson.id}`}
                                                key={lesson.id}
                                                className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm border hover:bg-muted/50 transition"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <BookOpen size={18} className="text-primary" />
                                                    <span className="text-sm font-medium text-foreground">{lesson.title}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Clock size={14} />
                                                    {lesson.duration ?? '—'}
                                                </div>
                                            </Link>
                                        ))
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
};

export default SectionList;
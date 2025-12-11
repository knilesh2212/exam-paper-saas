import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export const Navbar = () => {
    return (
        <nav className="border-b bg-background sticky top-0 z-50">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-90 transition-opacity">
                    <div className="bg-primary text-primary-foreground p-1 rounded-md">
                        <FileText className="h-5 w-5" />
                    </div>
                    <span>ExamGen</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="sm">
                        <Link to="/">Dashboard</Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link to="/create">Create New</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
};

import { format } from 'date-fns';
import ja from 'date-fns/locale/ja';

export const toDateWeek = (date: string) => {
    if (!date) return null;
    return format(new Date(date), 'yyyy-MM-dd(E) HH:mm', { locale: ja });
};

export const today = () => {
    return format(new Date(), 'yyyy-MM-dd');
};
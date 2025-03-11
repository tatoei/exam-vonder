import { clsx, type ClassValue } from 'clsx'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import { twMerge } from 'tailwind-merge'


dayjs.extend(buddhistEra)

const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

const toThaiDate = (date: Date | string, format = 'DD MMM BBBB') => {
	dayjs.locale('th')
	return dayjs(date).format(format)
}


export {
	cn,
    toThaiDate
}

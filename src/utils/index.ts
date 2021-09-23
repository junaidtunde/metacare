export const convertCmToFt = (height: number) => {
    const realFeet = ((height*0.393700) / 12);

    const feet = Math.floor(realFeet);
    const inches = Math.round((realFeet - feet) * 12);

    return { feet, inches };
}

export const sortList = (list: any[], element: string, value: string) => {
    const criteria = element.toLowerCase();
    let result

    if (criteria === 'height') {
        result = value === 'desc' ? list.sort((a, b) => b[criteria] - a[criteria]) : list.sort((a, b) => a[criteria] - b[criteria]);
    } else {
        result = value === 'desc' ? list.sort((a, b) => a[criteria].localeCompare(b[criteria])) : list.sort((a, b) => b[criteria].localeCompare(a[criteria]));
    }

    return result;
}
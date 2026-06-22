export const campusColorMapping = {
    "VGU": "blue",
    "SGU": "green",
    "ADYPU": "purple",
    "All Universities": "red"
};

export const getCampusColor = (university) => {
    if (!university) return "red";
    const uniKey = university.toUpperCase();
    return campusColorMapping[uniKey] || "red"; // Default color for unknown campuses
};

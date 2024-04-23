export const getProvince = async () => {
    
 
    const options = {
        method: "GET",
        url: `/provinces/`,
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await axios.request(options);
        const dataArray = response.data.map((e) => ({
            ...e,
            code: e.code,
            name: e.name
                .toLowerCase()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
        }));
        return dataArray;
    } catch (error) {
        console.log(error);
    }
};
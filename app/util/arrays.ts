export const getContiguousSubarrays = <T>(arr: T[]): T[][] => {
    const subarrays: T[][] = []
    let subarrays_right: T[][] = []

    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        
        subarrays_right.push([])

        subarrays_right = subarrays_right.map(sa => ([...sa, element]))

        subarrays.push(...subarrays_right)
    }

    return subarrays
}
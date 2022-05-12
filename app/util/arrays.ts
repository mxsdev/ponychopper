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

export function shuffle<T>(array: T[]) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

export function includeElement<T>(arr: T[], el: T, include: boolean, options?: { full: T[], soloMode: boolean }): T[] {
  if(options?.soloMode && options?.full) {
    if(arr.some(x => (x !== el))) {
      return [ el ]
    } else {
      return options.full
    }
  }

  return [
    ...arr.filter(x => x !== el),
    ...(include ? [ el ] : [])
  ]
}
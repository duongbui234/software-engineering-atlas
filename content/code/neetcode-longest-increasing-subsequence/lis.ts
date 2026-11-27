function lisByBrute(nums: number[]) {
    function visit(i: number, last: number): number {
        if (i === nums.length) return 0
        const skip = visit(i+1,last)
        return last < 0 || nums[last] < nums[i]
            ? Math.max(skip,1+visit(i+1,i))
            : skip
    }
    return visit(0,-1)
}

function lisByEndpoint(nums: number[], work: {comparisons:number} = {comparisons:0}) {
    const longest = Array(nums.length).fill(1)
    let best = 0
    for (let i=0;i<nums.length;i++) {
        for (let j=0;j<i;j++) {
            work.comparisons++
            if (nums[j] < nums[i]) longest[i] = Math.max(longest[i],longest[j]+1)
        }
        best = Math.max(best,longest[i])
    }
    return best
}

function lisByTails(nums: number[], work: {comparisons:number} = {comparisons:0}) {
    const tails: number[] = []
    for (const x of nums) {
        let lo=0, hi=tails.length
        while (lo < hi) {
            const mid=lo+Math.floor((hi-lo)/2)
            work.comparisons++
            if (tails[mid] < x) lo=mid+1
            else hi=mid
        }
        tails[lo]=x
    }
    return tails.length
}

const ascending=Array.from({length:2500},(_,i)=>i-1250)
const cases: [number[],number][] = [
    [[],0],[[-10000],1],[[4,8,1,6,9,2],3],[[1,4,9,-1],3],
    [[3,3,3,3],1],[[8,6,4,2],1],[[-10000,-2,0,10000],4],[[1,3,3,8],3],
    [[-3,-1,-2,0],3],[[2,6,3,4,1,5],4],[ascending,2500],[[...ascending].reverse(),1],
]
for (const [nums,want] of cases) {
    if (lisByEndpoint(nums)!==want || lisByTails(nums)!==want ||
        (nums.length<=10 && lisByBrute(nums)!==want)) throw new Error('Ca kiểm tra sai')
}
let checked=0
function crossCheck(nums: number[]) {
    if (nums.length) {
        const want=lisByBrute(nums)
        if (lisByEndpoint(nums)!==want || lisByTails(nums)!==want) throw new Error('Đối chiếu sai')
        checked++
    }
    if (nums.length===6) return
    for (let x=-2;x<=1;x++) crossCheck([...nums,x])
}
crossCheck([])
const dpWork={comparisons:0}, tailWork={comparisons:0}
lisByEndpoint(ascending,dpWork)
lisByTails(ascending,tailWork)
console.log(`${cases.length}/${cases.length} ca đúng`)
console.log(`${checked} mảng nhỏ đối chiếu với vét cạn`)
console.log(`n=2500, tăng dần: DP ${dpWork.comparisons}, tails ${tailWork.comparisons} so sánh giá trị`)

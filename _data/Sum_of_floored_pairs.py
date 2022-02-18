class Solution:

    def sumOfFlooredPairs(self, nums: List[int]) -> int:

        MOD = 10**9 + 7

        nums.sort()

        n = len(nums)

        maxi = max(nums)

        ans = 0

        for i in range(n):

            j = 1

            while j * nums[i] <= maxi:

                left = bisect.bisect_left(nums, j * nums[i])

                right = bisect.bisect_right(nums, (j + 1) * nums[i] - 1)

                ans += j * (right - left)

                j += 1

        return ans % MOD

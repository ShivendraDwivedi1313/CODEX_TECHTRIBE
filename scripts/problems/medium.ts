import { ProblemDef } from './index'

export const mediumProblems: ProblemDef[] = [
  {
    title: 'Merge Overlapping Intervals', slug: 'merge-overlapping-intervals', difficulty: 'MEDIUM',
    tags: ['arrays', 'sorting', 'intervals'],
    statement: 'Given a collection of intervals where each interval is a pair [start, end], merge all overlapping intervals and return the result sorted by start time.',
    inputFormat: 'First line: n (number of intervals).\nNext n lines: two integers start and end per line.',
    outputFormat: 'Each merged interval on a separate line: start end.',
    constraints: '1 ≤ n ≤ 10^4\n0 ≤ start ≤ end ≤ 10^4',
    visibleSamples: [
      { input: '4\n1 3\n2 6\n8 10\n15 18', output: '1 6\n8 10\n15 18' },
      { input: '2\n1 4\n4 5', output: '1 5' }
    ],
    hiddenTestCases: [
      { input: '4\n1 3\n2 6\n8 10\n15 18', expectedOutput: '1 6\n8 10\n15 18' },
      { input: '2\n1 4\n4 5', expectedOutput: '1 5' },
      { input: '1\n1 1', expectedOutput: '1 1' },
      { input: '3\n1 10\n2 3\n4 5', expectedOutput: '1 10' },
      { input: '5\n1 2\n3 4\n5 6\n7 8\n9 10', expectedOutput: '1 2\n3 4\n5 6\n7 8\n9 10' },
      { input: '3\n1 4\n0 2\n3 5', expectedOutput: '0 5' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n;cin>>n;\n    vector<pair<int,int>>v(n);\n    for(int i=0;i<n;i++)cin>>v[i].first>>v[i].second;\n    // Your code here\n    return 0;\n}',
      python: 'n=int(input())\nintervals=[list(map(int,input().split()))for _ in range(n)]\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const n=+lines[0];const iv=[];for(let i=1;i<=n;i++)iv.push(lines[i].split(" ").map(Number));\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){int n;cin>>n;vector<pair<int,int>>v(n);for(int i=0;i<n;i++)cin>>v[i].first>>v[i].second;sort(v.begin(),v.end());vector<pair<int,int>>r;r.push_back(v[0]);for(int i=1;i<n;i++){if(v[i].first<=r.back().second)r.back().second=max(r.back().second,v[i].second);else r.push_back(v[i]);}for(auto&p:r)cout<<p.first<<" "<<p.second<<"\\n";return 0;}',
      python: 'n=int(input())\niv=sorted([list(map(int,input().split()))for _ in range(n)])\nr=[iv[0]]\nfor s,e in iv[1:]:\n    if s<=r[-1][1]:r[-1][1]=max(r[-1][1],e)\n    else:r.append([s,e])\nfor a,b in r:print(a,b)',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const n=+lines[0];const iv=[];for(let i=1;i<=n;i++)iv.push(lines[i].split(" ").map(Number));iv.sort((a,b)=>a[0]-b[0]);const r=[iv[0]];for(let i=1;i<n;i++){if(iv[i][0]<=r[r.length-1][1])r[r.length-1][1]=Math.max(r[r.length-1][1],iv[i][1]);else r.push(iv[i]);}console.log(r.map(p=>p.join(" ")).join("\\n"));'
    }
  },
  {
    title: 'Longest Unique Substring', slug: 'longest-unique-substring', difficulty: 'MEDIUM',
    tags: ['strings', 'sliding-window', 'hash-map'],
    statement: 'Given a string s, find the length of the longest substring without repeating characters.',
    inputFormat: 'A single line: the string s.',
    outputFormat: 'A single integer.',
    constraints: '0 ≤ |s| ≤ 5×10^4\ns consists of English letters, digits, symbols and spaces.',
    visibleSamples: [
      { input: 'abcabcbb', output: '3', explanation: 'The answer is "abc"' },
      { input: 'bbbbb', output: '1' },
      { input: 'pwwkew', output: '3' }
    ],
    hiddenTestCases: [
      { input: 'abcabcbb', expectedOutput: '3' },
      { input: 'bbbbb', expectedOutput: '1' },
      { input: 'pwwkew', expectedOutput: '3' },
      { input: '', expectedOutput: '0' },
      { input: 'a', expectedOutput: '1' },
      { input: 'abcdef', expectedOutput: '6' },
      { input: 'dvdf', expectedOutput: '3' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    string s;getline(cin,s);\n    // Your code here\n    return 0;\n}',
      python: 's=input()\n# Your code here',
      javascript: 'const s=require("fs").readFileSync("/dev/stdin","utf8").trim();\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){string s;getline(cin,s);unordered_map<char,int>m;int ans=0,l=0;for(int r=0;r<(int)s.size();r++){if(m.count(s[r]))l=max(l,m[s[r]]+1);m[s[r]]=r;ans=max(ans,r-l+1);}cout<<ans;return 0;}',
      python: 's=input()\nd={};ans=l=0\nfor r,c in enumerate(s):\n    if c in d and d[c]>=l:l=d[c]+1\n    d[c]=r;ans=max(ans,r-l+1)\nprint(ans)',
      javascript: 'const s=require("fs").readFileSync("/dev/stdin","utf8").trim();const m={};let ans=0,l=0;for(let r=0;r<s.length;r++){if(m[s[r]]!==undefined&&m[s[r]]>=l)l=m[s[r]]+1;m[s[r]]=r;ans=Math.max(ans,r-l+1);}console.log(ans);'
    }
  },
  {
    title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'MEDIUM',
    tags: ['dfs', 'bfs', 'matrix', 'graph'],
    statement: 'Given an m×n grid of \'1\'s (land) and \'0\'s (water), count the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.',
    inputFormat: 'First line: m n.\nNext m lines: n characters (0 or 1) separated by spaces.',
    outputFormat: 'A single integer: the number of islands.',
    constraints: '1 ≤ m, n ≤ 300',
    visibleSamples: [
      { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', output: '1' },
      { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', output: '3' }
    ],
    hiddenTestCases: [
      { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', expectedOutput: '1' },
      { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', expectedOutput: '3' },
      { input: '1 1\n0', expectedOutput: '0' },
      { input: '1 1\n1', expectedOutput: '1' },
      { input: '3 3\n1 0 1\n0 1 0\n1 0 1', expectedOutput: '5' },
      { input: '2 2\n1 1\n1 1', expectedOutput: '1' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int m,n;cin>>m>>n;\n    vector<vector<int>>g(m,vector<int>(n));\n    for(int i=0;i<m;i++)for(int j=0;j<n;j++)cin>>g[i][j];\n    // Your code here\n    return 0;\n}',
      python: 'm,n=map(int,input().split())\ng=[list(map(int,input().split()))for _ in range(m)]\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[m,n]=lines[0].split(" ").map(Number);const g=[];for(let i=0;i<m;i++)g.push(lines[i+1].split(" ").map(Number));\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint m,n;void dfs(vector<vector<int>>&g,int r,int c){if(r<0||r>=m||c<0||c>=n||g[r][c]!=1)return;g[r][c]=0;dfs(g,r+1,c);dfs(g,r-1,c);dfs(g,r,c+1);dfs(g,r,c-1);}int main(){cin>>m>>n;vector<vector<int>>g(m,vector<int>(n));for(int i=0;i<m;i++)for(int j=0;j<n;j++)cin>>g[i][j];int cnt=0;for(int i=0;i<m;i++)for(int j=0;j<n;j++)if(g[i][j]==1){dfs(g,i,j);cnt++;}cout<<cnt;return 0;}',
      python: 'import sys\nsys.setrecursionlimit(100000)\nm,n=map(int,input().split())\ng=[list(map(int,input().split()))for _ in range(m)]\ndef dfs(r,c):\n    if r<0 or r>=m or c<0 or c>=n or g[r][c]!=1:return\n    g[r][c]=0\n    dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1)\ncnt=0\nfor i in range(m):\n    for j in range(n):\n        if g[i][j]==1:dfs(i,j);cnt+=1\nprint(cnt)',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[m,n]=lines[0].split(" ").map(Number);const g=[];for(let i=0;i<m;i++)g.push(lines[i+1].split(" ").map(Number));function dfs(r,c){if(r<0||r>=m||c<0||c>=n||g[r][c]!==1)return;g[r][c]=0;dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1);}let cnt=0;for(let i=0;i<m;i++)for(let j=0;j<n;j++)if(g[i][j]===1){dfs(i,j);cnt++;}console.log(cnt);'
    }
  },
  {
    title: 'Rotated Array Search', slug: 'rotated-array-search', difficulty: 'MEDIUM',
    tags: ['binary-search', 'arrays'],
    statement: 'A sorted array of distinct integers was rotated at some unknown pivot. Given the rotated array and a target value, find the index of the target in O(log n) time. Return -1 if not found.',
    inputFormat: 'First line: n and target.\nSecond line: n space-separated integers.',
    outputFormat: 'A single integer: index or -1.',
    constraints: '1 ≤ n ≤ 5000\n-10^4 ≤ nums[i], target ≤ 10^4\nAll values distinct.',
    visibleSamples: [
      { input: '7 0\n4 5 6 7 0 1 2', output: '4' },
      { input: '7 3\n4 5 6 7 0 1 2', output: '-1' }
    ],
    hiddenTestCases: [
      { input: '7 0\n4 5 6 7 0 1 2', expectedOutput: '4' },
      { input: '7 3\n4 5 6 7 0 1 2', expectedOutput: '-1' },
      { input: '1 0\n1', expectedOutput: '-1' },
      { input: '1 1\n1', expectedOutput: '0' },
      { input: '5 5\n3 4 5 1 2', expectedOutput: '2' },
      { input: '5 1\n1 2 3 4 5', expectedOutput: '0' },
      { input: '3 3\n3 1 2', expectedOutput: '0' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n,t;cin>>n>>t;\n    vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];\n    // Your code here\n    return 0;\n}',
      python: 'n,t=map(int,input().split())\na=list(map(int,input().split()))\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,t]=lines[0].split(" ").map(Number);const a=lines[1].split(" ").map(Number);\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){int n,t;cin>>n>>t;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];int l=0,r=n-1;while(l<=r){int m=(l+r)/2;if(a[m]==t){cout<<m;return 0;}if(a[l]<=a[m]){if(a[l]<=t&&t<a[m])r=m-1;else l=m+1;}else{if(a[m]<t&&t<=a[r])l=m+1;else r=m-1;}}cout<<-1;return 0;}',
      python: 'n,t=map(int,input().split())\na=list(map(int,input().split()))\nl,r=0,n-1;ans=-1\nwhile l<=r:\n    m=(l+r)//2\n    if a[m]==t:ans=m;break\n    if a[l]<=a[m]:\n        if a[l]<=t<a[m]:r=m-1\n        else:l=m+1\n    else:\n        if a[m]<t<=a[r]:l=m+1\n        else:r=m-1\nprint(ans)',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,t]=lines[0].split(" ").map(Number);const a=lines[1].split(" ").map(Number);let l=0,r=n-1,ans=-1;while(l<=r){const m=(l+r)>>1;if(a[m]===t){ans=m;break;}if(a[l]<=a[m]){if(a[l]<=t&&t<a[m])r=m-1;else l=m+1;}else{if(a[m]<t&&t<=a[r])l=m+1;else r=m-1;}}console.log(ans);'
    }
  },
  {
    title: 'Top K Frequent Elements', slug: 'top-k-frequent', difficulty: 'MEDIUM',
    tags: ['hash-map', 'heap', 'sorting'],
    statement: 'Given an integer array and an integer k, return the k most frequent elements in any order.',
    inputFormat: 'First line: n k.\nSecond line: n space-separated integers.',
    outputFormat: 'k space-separated integers (any order).',
    constraints: '1 ≤ k ≤ number of unique elements ≤ n ≤ 10^5',
    visibleSamples: [
      { input: '6 2\n1 1 1 2 2 3', output: '1 2' },
      { input: '1 1\n1', output: '1' }
    ],
    hiddenTestCases: [
      { input: '6 2\n1 1 1 2 2 3', expectedOutput: '1 2' },
      { input: '1 1\n1', expectedOutput: '1' },
      { input: '4 2\n1 2 2 1', expectedOutput: '1 2' },
      { input: '5 1\n3 3 3 1 2', expectedOutput: '3' },
      { input: '7 3\n1 1 2 2 3 3 4', expectedOutput: '1 2 3' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n,k;cin>>n>>k;\n    vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];\n    // Your code here\n    return 0;\n}',
      python: 'n,k=map(int,input().split())\na=list(map(int,input().split()))\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,k]=lines[0].split(" ").map(Number);const a=lines[1].split(" ").map(Number);\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){int n,k;cin>>n>>k;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];unordered_map<int,int>freq;for(int x:a)freq[x]++;vector<pair<int,int>>v;for(auto&[val,cnt]:freq)v.push_back({cnt,val});sort(v.rbegin(),v.rend());for(int i=0;i<k;i++){if(i)cout<<" ";cout<<v[i].second;}return 0;}',
      python: 'from collections import Counter\nn,k=map(int,input().split())\na=list(map(int,input().split()))\nc=Counter(a).most_common(k)\nprint(" ".join(str(x) for x,_ in c))',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,k]=lines[0].split(" ").map(Number);const a=lines[1].split(" ").map(Number);const freq={};for(const x of a)freq[x]=(freq[x]||0)+1;const sorted=Object.entries(freq).sort((a,b)=>b[1]-a[1]);console.log(sorted.slice(0,k).map(e=>e[0]).join(" "));'
    }
  },
  {
    title: 'Coin Change', slug: 'coin-change', difficulty: 'MEDIUM',
    tags: ['dynamic-programming'],
    statement: 'You have an infinite supply of coins with given denominations. Find the fewest number of coins needed to make up a given amount. Return -1 if it cannot be made.',
    inputFormat: 'First line: n (number of denominations) and amount.\nSecond line: n space-separated denomination values.',
    outputFormat: 'A single integer: minimum coins or -1.',
    constraints: '1 ≤ n ≤ 12\n1 ≤ amount ≤ 10^4\n1 ≤ coins[i] ≤ 2^31-1',
    visibleSamples: [
      { input: '3 11\n1 2 5', output: '3', explanation: '5+5+1' },
      { input: '1 3\n2', output: '-1' }
    ],
    hiddenTestCases: [
      { input: '3 11\n1 2 5', expectedOutput: '3' },
      { input: '1 3\n2', expectedOutput: '-1' },
      { input: '1 0\n1', expectedOutput: '0' },
      { input: '3 6\n1 3 4', expectedOutput: '2' },
      { input: '2 100\n1 50', expectedOutput: '2' },
      { input: '3 7\n2 3 5', expectedOutput: '2' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n,amt;cin>>n>>amt;\n    vector<int>c(n);for(int i=0;i<n;i++)cin>>c[i];\n    // Your code here\n    return 0;\n}',
      python: 'n,amt=map(int,input().split())\ncoins=list(map(int,input().split()))\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,amt]=lines[0].split(" ").map(Number);const coins=lines[1].split(" ").map(Number);\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){int n,a;cin>>n>>a;vector<int>c(n);for(int i=0;i<n;i++)cin>>c[i];vector<int>dp(a+1,a+1);dp[0]=0;for(int i=1;i<=a;i++)for(int x:c)if(x<=i)dp[i]=min(dp[i],dp[i-x]+1);cout<<(dp[a]>a?-1:dp[a]);return 0;}',
      python: 'n,a=map(int,input().split())\nc=list(map(int,input().split()))\ndp=[a+1]*(a+1);dp[0]=0\nfor i in range(1,a+1):\n    for x in c:\n        if x<=i:dp[i]=min(dp[i],dp[i-x]+1)\nprint(dp[a] if dp[a]<=a else -1)',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,a]=lines[0].split(" ").map(Number);const c=lines[1].split(" ").map(Number);const dp=Array(a+1).fill(a+1);dp[0]=0;for(let i=1;i<=a;i++)for(const x of c)if(x<=i)dp[i]=Math.min(dp[i],dp[i-x]+1);console.log(dp[a]>a?-1:dp[a]);'
    }
  },
  {
    title: 'Longest Common Subsequence', slug: 'longest-common-subsequence', difficulty: 'MEDIUM',
    tags: ['dynamic-programming', 'strings'],
    statement: 'Given two strings, return the length of their longest common subsequence. A subsequence is a sequence derivable from another by deleting some or no elements without changing order.',
    inputFormat: 'First line: string s1.\nSecond line: string s2.',
    outputFormat: 'A single integer.',
    constraints: '1 ≤ |s1|, |s2| ≤ 1000\nStrings contain only lowercase English letters.',
    visibleSamples: [
      { input: 'abcde\nace', output: '3', explanation: 'LCS is "ace"' },
      { input: 'abc\nabc', output: '3' },
      { input: 'abc\ndef', output: '0' }
    ],
    hiddenTestCases: [
      { input: 'abcde\nace', expectedOutput: '3' },
      { input: 'abc\nabc', expectedOutput: '3' },
      { input: 'abc\ndef', expectedOutput: '0' },
      { input: 'a\na', expectedOutput: '1' },
      { input: 'abcba\nabcba', expectedOutput: '5' },
      { input: 'oxcpqrsvwf\nshmtulqrypy', expectedOutput: '2' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    string a,b;cin>>a>>b;\n    // Your code here\n    return 0;\n}',
      python: 'a=input()\nb=input()\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const a=lines[0],b=lines[1];\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){string a,b;cin>>a>>b;int m=a.size(),n=b.size();vector<vector<int>>dp(m+1,vector<int>(n+1,0));for(int i=1;i<=m;i++)for(int j=1;j<=n;j++)dp[i][j]=a[i-1]==b[j-1]?dp[i-1][j-1]+1:max(dp[i-1][j],dp[i][j-1]);cout<<dp[m][n];return 0;}',
      python: 'a=input();b=input()\nm,n=len(a),len(b)\ndp=[[0]*(n+1)for _ in range(m+1)]\nfor i in range(1,m+1):\n    for j in range(1,n+1):\n        dp[i][j]=dp[i-1][j-1]+1 if a[i-1]==b[j-1] else max(dp[i-1][j],dp[i][j-1])\nprint(dp[m][n])',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const a=lines[0],b=lines[1];const m=a.length,n=b.length;const dp=Array.from({length:m+1},()=>Array(n+1).fill(0));for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);console.log(dp[m][n]);'
    }
  },
  {
    title: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence', difficulty: 'MEDIUM',
    tags: ['dynamic-programming', 'binary-search'],
    statement: 'Given an integer array, return the length of the longest strictly increasing subsequence.',
    inputFormat: 'First line: n.\nSecond line: n space-separated integers.',
    outputFormat: 'A single integer.',
    constraints: '1 ≤ n ≤ 2500\n-10^4 ≤ nums[i] ≤ 10^4',
    visibleSamples: [
      { input: '8\n10 9 2 5 3 7 101 18', output: '4', explanation: '[2,3,7,101]' },
      { input: '6\n0 1 0 3 2 3', output: '4' }
    ],
    hiddenTestCases: [
      { input: '8\n10 9 2 5 3 7 101 18', expectedOutput: '4' },
      { input: '6\n0 1 0 3 2 3', expectedOutput: '4' },
      { input: '7\n7 7 7 7 7 7 7', expectedOutput: '1' },
      { input: '1\n0', expectedOutput: '1' },
      { input: '5\n1 2 3 4 5', expectedOutput: '5' },
      { input: '5\n5 4 3 2 1', expectedOutput: '1' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n;cin>>n;\n    vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];\n    // Your code here\n    return 0;\n}',
      python: 'n=int(input())\na=list(map(int,input().split()))\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const n=+lines[0];const a=lines[1].split(" ").map(Number);\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){int n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];vector<int>t;for(int x:a){auto it=lower_bound(t.begin(),t.end(),x);if(it==t.end())t.push_back(x);else *it=x;}cout<<t.size();return 0;}',
      python: 'import bisect\nn=int(input())\na=list(map(int,input().split()))\nt=[]\nfor x in a:\n    p=bisect.bisect_left(t,x)\n    if p==len(t):t.append(x)\n    else:t[p]=x\nprint(len(t))',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const a=lines[1].split(" ").map(Number);const t=[];for(const x of a){let l=0,r=t.length;while(l<r){const m=(l+r)>>1;if(t[m]<x)l=m+1;else r=m;}if(l===t.length)t.push(x);else t[l]=x;}console.log(t.length);'
    }
  },
  {
    title: 'Graph BFS Shortest Path', slug: 'graph-bfs-shortest', difficulty: 'MEDIUM',
    tags: ['graph', 'bfs'],
    statement: 'Given an unweighted undirected graph with n nodes (1-indexed) and m edges, find the shortest path (in number of edges) from node 1 to node n. Print -1 if unreachable.',
    inputFormat: 'First line: n m.\nNext m lines: two integers u v (an edge).',
    outputFormat: 'A single integer: shortest distance or -1.',
    constraints: '2 ≤ n ≤ 10^5\n0 ≤ m ≤ 2×10^5',
    visibleSamples: [
      { input: '5 6\n1 2\n1 3\n2 4\n3 4\n4 5\n2 5', output: '2' },
      { input: '3 1\n1 2', output: '-1' }
    ],
    hiddenTestCases: [
      { input: '5 6\n1 2\n1 3\n2 4\n3 4\n4 5\n2 5', expectedOutput: '2' },
      { input: '3 1\n1 2', expectedOutput: '-1' },
      { input: '2 1\n1 2', expectedOutput: '1' },
      { input: '4 4\n1 2\n2 3\n3 4\n1 4', expectedOutput: '1' },
      { input: '2 0', expectedOutput: '-1' },
      { input: '5 4\n1 2\n2 3\n3 4\n4 5', expectedOutput: '4' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n,m;cin>>n>>m;\n    vector<vector<int>>adj(n+1);\n    for(int i=0;i<m;i++){int u,v;cin>>u>>v;adj[u].push_back(v);adj[v].push_back(u);}\n    // Your code here\n    return 0;\n}',
      python: 'n,m=map(int,input().split())\nadj=[[]for _ in range(n+1)]\nfor _ in range(m):\n    u,v=map(int,input().split())\n    adj[u].append(v);adj[v].append(u)\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,m]=lines[0].split(" ").map(Number);const adj=Array.from({length:n+1},()=>[]);for(let i=1;i<=m;i++){const[u,v]=lines[i].split(" ").map(Number);adj[u].push(v);adj[v].push(u);}\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){int n,m;cin>>n>>m;vector<vector<int>>adj(n+1);for(int i=0;i<m;i++){int u,v;cin>>u>>v;adj[u].push_back(v);adj[v].push_back(u);}vector<int>dist(n+1,-1);dist[1]=0;queue<int>q;q.push(1);while(!q.empty()){int u=q.front();q.pop();for(int v:adj[u])if(dist[v]==-1){dist[v]=dist[u]+1;q.push(v);}}cout<<dist[n];return 0;}',
      python: 'from collections import deque\nn,m=map(int,input().split())\nadj=[[]for _ in range(n+1)]\nfor _ in range(m):\n    u,v=map(int,input().split())\n    adj[u].append(v);adj[v].append(u)\ndist=[-1]*(n+1);dist[1]=0;q=deque([1])\nwhile q:\n    u=q.popleft()\n    for v in adj[u]:\n        if dist[v]==-1:dist[v]=dist[u]+1;q.append(v)\nprint(dist[n])',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,m]=lines[0].split(" ").map(Number);const adj=Array.from({length:n+1},()=>[]);for(let i=1;i<=m;i++){const[u,v]=lines[i].split(" ").map(Number);adj[u].push(v);adj[v].push(u);}const dist=Array(n+1).fill(-1);dist[1]=0;const q=[1];let h=0;while(h<q.length){const u=q[h++];for(const v of adj[u])if(dist[v]===-1){dist[v]=dist[u]+1;q.push(v);}}console.log(dist[n]);'
    }
  },
  {
    title: '0/1 Knapsack', slug: '01-knapsack', difficulty: 'MEDIUM',
    tags: ['dynamic-programming'],
    statement: 'Given n items, each with a weight and a value, and a knapsack with capacity W, find the maximum total value you can carry. Each item can be used at most once.',
    inputFormat: 'First line: n W.\nNext n lines: weight value for each item.',
    outputFormat: 'A single integer: the maximum value.',
    constraints: '1 ≤ n ≤ 100\n1 ≤ W ≤ 10^4\n1 ≤ weight[i], value[i] ≤ 1000',
    visibleSamples: [
      { input: '3 50\n10 60\n20 100\n30 120', output: '220', explanation: 'Take items 2 and 3' },
      { input: '4 7\n1 1\n3 4\n4 5\n5 7', output: '9' }
    ],
    hiddenTestCases: [
      { input: '3 50\n10 60\n20 100\n30 120', expectedOutput: '220' },
      { input: '4 7\n1 1\n3 4\n4 5\n5 7', expectedOutput: '9' },
      { input: '1 1\n1 1', expectedOutput: '1' },
      { input: '1 0\n1 1', expectedOutput: '0' },
      { input: '3 10\n5 10\n4 40\n6 30', expectedOutput: '70' },
      { input: '5 10\n2 6\n2 10\n3 12\n7 13\n1 5', expectedOutput: '33' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n,W;cin>>n>>W;\n    vector<int>w(n),v(n);\n    for(int i=0;i<n;i++)cin>>w[i]>>v[i];\n    // Your code here\n    return 0;\n}',
      python: 'n,W=map(int,input().split())\nitems=[list(map(int,input().split()))for _ in range(n)]\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,W]=lines[0].split(" ").map(Number);const items=[];for(let i=1;i<=n;i++)items.push(lines[i].split(" ").map(Number));\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){int n,W;cin>>n>>W;vector<int>w(n),v(n);for(int i=0;i<n;i++)cin>>w[i]>>v[i];vector<int>dp(W+1,0);for(int i=0;i<n;i++)for(int j=W;j>=w[i];j--)dp[j]=max(dp[j],dp[j-w[i]]+v[i]);cout<<dp[W];return 0;}',
      python: 'n,W=map(int,input().split())\nitems=[list(map(int,input().split()))for _ in range(n)]\ndp=[0]*(W+1)\nfor w,v in items:\n    for j in range(W,w-1,-1):\n        dp[j]=max(dp[j],dp[j-w]+v)\nprint(dp[W])',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,W]=lines[0].split(" ").map(Number);const items=[];for(let i=1;i<=n;i++)items.push(lines[i].split(" ").map(Number));const dp=Array(W+1).fill(0);for(const[w,v]of items)for(let j=W;j>=w;j--)dp[j]=Math.max(dp[j],dp[j-w]+v);console.log(dp[W]);'
    }
  },
]

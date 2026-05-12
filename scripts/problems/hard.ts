import { ProblemDef } from './index'

export const hardProblems: ProblemDef[] = [
  {
    title: 'Sliding Window Maximum', slug: 'sliding-window-maximum', difficulty: 'HARD',
    tags: ['deque', 'sliding-window'],
    statement: 'Given an integer array and a sliding window of size k moving from left to right, return the maximum value in each window position.',
    inputFormat: 'First line: n k.\nSecond line: n space-separated integers.',
    outputFormat: 'Space-separated maximum values for each window.',
    constraints: '1 ≤ k ≤ n ≤ 10^5\n-10^4 ≤ nums[i] ≤ 10^4',
    visibleSamples: [
      { input: '8 3\n1 3 -1 -3 5 3 6 7', output: '3 3 5 5 6 7' },
      { input: '1 1\n1', output: '1' }
    ],
    hiddenTestCases: [
      { input: '8 3\n1 3 -1 -3 5 3 6 7', expectedOutput: '3 3 5 5 6 7' },
      { input: '1 1\n1', expectedOutput: '1' },
      { input: '4 2\n1 3 1 2', expectedOutput: '3 3 2' },
      { input: '5 5\n5 4 3 2 1', expectedOutput: '5' },
      { input: '5 1\n1 2 3 4 5', expectedOutput: '1 2 3 4 5' },
      { input: '6 3\n1 1 1 1 1 1', expectedOutput: '1 1 1 1' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n,k;cin>>n>>k;\n    vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];\n    // Your code here\n    return 0;\n}',
      python: 'n,k=map(int,input().split())\na=list(map(int,input().split()))\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,k]=lines[0].split(" ").map(Number);const a=lines[1].split(" ").map(Number);\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){int n,k;cin>>n>>k;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];deque<int>dq;vector<int>res;for(int i=0;i<n;i++){while(!dq.empty()&&dq.front()<=i-k)dq.pop_front();while(!dq.empty()&&a[dq.back()]<=a[i])dq.pop_back();dq.push_back(i);if(i>=k-1)res.push_back(a[dq.front()]);}for(int i=0;i<(int)res.size();i++){if(i)cout<<" ";cout<<res[i];}return 0;}',
      python: 'from collections import deque\nn,k=map(int,input().split())\na=list(map(int,input().split()))\ndq=deque();res=[]\nfor i in range(n):\n    while dq and dq[0]<=i-k:dq.popleft()\n    while dq and a[dq[-1]]<=a[i]:dq.pop()\n    dq.append(i)\n    if i>=k-1:res.append(a[dq[0]])\nprint(" ".join(map(str,res)))',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,k]=lines[0].split(" ").map(Number);const a=lines[1].split(" ").map(Number);const dq=[],res=[];let h=0;for(let i=0;i<n;i++){while(h<dq.length&&dq[h]<=i-k)h++;while(h<dq.length&&a[dq[dq.length-1]]<=a[i])dq.pop();dq.push(i);if(i>=k-1)res.push(a[dq[h]]);}console.log(res.join(" "));'
    }
  },
  {
    title: 'Dijkstra Shortest Paths', slug: 'dijkstra-shortest-paths', difficulty: 'HARD',
    tags: ['graph', 'dijkstra', 'priority-queue'],
    statement: 'Given a weighted directed graph with n nodes (1-indexed) and m edges, find the shortest distance from node 1 to all other nodes using Dijkstra\'s algorithm. Print -1 for unreachable nodes.',
    inputFormat: 'First line: n m.\nNext m lines: u v w (directed edge from u to v with weight w).',
    outputFormat: 'n-1 space-separated integers: shortest distance from 1 to nodes 2, 3, ..., n.',
    constraints: '1 ≤ n ≤ 10^5\n1 ≤ m ≤ 2×10^5\n1 ≤ w ≤ 10^9',
    visibleSamples: [
      { input: '5 6\n1 2 2\n1 3 4\n2 3 1\n2 4 7\n3 5 3\n4 5 1', output: '2 3 9 6' }
    ],
    hiddenTestCases: [
      { input: '5 6\n1 2 2\n1 3 4\n2 3 1\n2 4 7\n3 5 3\n4 5 1', expectedOutput: '2 3 9 6' },
      { input: '2 1\n1 2 5', expectedOutput: '5' },
      { input: '3 0', expectedOutput: '-1 -1' },
      { input: '4 4\n1 2 1\n2 3 2\n3 4 3\n1 4 10', expectedOutput: '1 3 6' },
      { input: '3 3\n1 2 1\n2 3 1\n1 3 3', expectedOutput: '1 2' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n,m;cin>>n>>m;\n    vector<vector<pair<int,int>>>adj(n+1);\n    for(int i=0;i<m;i++){int u,v,w;cin>>u>>v>>w;adj[u].push_back({v,w});}\n    // Your code here\n    return 0;\n}',
      python: 'import heapq\nn,m=map(int,input().split())\nadj=[[]for _ in range(n+1)]\nfor _ in range(m):\n    u,v,w=map(int,input().split())\n    adj[u].append((v,w))\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,m]=lines[0].split(" ").map(Number);const adj=Array.from({length:n+1},()=>[]);for(let i=1;i<=m;i++){const[u,v,w]=lines[i].split(" ").map(Number);adj[u].push([v,w]);}\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){int n,m;cin>>n>>m;vector<vector<pair<int,long long>>>adj(n+1);for(int i=0;i<m;i++){int u,v;long long w;cin>>u>>v>>w;adj[u].push_back({v,w});}vector<long long>dist(n+1,LLONG_MAX);dist[1]=0;priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<>>pq;pq.push({0,1});while(!pq.empty()){auto[d,u]=pq.top();pq.pop();if(d>dist[u])continue;for(auto&[v,w]:adj[u])if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;pq.push({dist[v],v});}}for(int i=2;i<=n;i++){if(i>2)cout<<" ";cout<<(dist[i]==LLONG_MAX?-1:dist[i]);}return 0;}',
      python: 'import heapq\nn,m=map(int,input().split())\nadj=[[]for _ in range(n+1)]\nfor _ in range(m):\n    u,v,w=map(int,input().split())\n    adj[u].append((v,w))\nINF=float("inf")\ndist=[INF]*(n+1);dist[1]=0\npq=[(0,1)]\nwhile pq:\n    d,u=heapq.heappop(pq)\n    if d>dist[u]:continue\n    for v,w in adj[u]:\n        if dist[u]+w<dist[v]:\n            dist[v]=dist[u]+w\n            heapq.heappush(pq,(dist[v],v))\nprint(" ".join(str(dist[i] if dist[i]!=INF else -1)for i in range(2,n+1)))',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,m]=lines[0].split(" ").map(Number);const adj=Array.from({length:n+1},()=>[]);for(let i=1;i<=m;i++){const[u,v,w]=lines[i].split(" ").map(Number);adj[u].push([v,w]);}const dist=Array(n+1).fill(Infinity);dist[1]=0;const pq=[[0,1]];while(pq.length){pq.sort((a,b)=>a[0]-b[0]);const[d,u]=pq.shift();if(d>dist[u])continue;for(const[v,w]of adj[u])if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;pq.push([dist[v],v]);}}const res=[];for(let i=2;i<=n;i++)res.push(dist[i]===Infinity?-1:dist[i]);console.log(res.join(" "));'
    }
  },
  {
    title: 'Kth Smallest in Sorted Matrix', slug: 'kth-smallest-sorted-matrix', difficulty: 'HARD',
    tags: ['heap', 'binary-search', 'matrix'],
    statement: 'Given an n×n matrix where each row and column is sorted in ascending order, find the kth smallest element.',
    inputFormat: 'First line: n k.\nNext n lines: n space-separated integers.',
    outputFormat: 'A single integer.',
    constraints: '1 ≤ n ≤ 300\n1 ≤ k ≤ n²\n-10^9 ≤ matrix[i][j] ≤ 10^9',
    visibleSamples: [
      { input: '3 8\n1 5 9\n10 11 13\n12 13 15', output: '13' },
      { input: '1 1\n-5', output: '-5' }
    ],
    hiddenTestCases: [
      { input: '3 8\n1 5 9\n10 11 13\n12 13 15', expectedOutput: '13' },
      { input: '1 1\n-5', expectedOutput: '-5' },
      { input: '2 1\n1 2\n3 4', expectedOutput: '1' },
      { input: '2 4\n1 2\n3 4', expectedOutput: '4' },
      { input: '3 5\n1 3 5\n6 7 12\n11 14 14', expectedOutput: '7' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n,k;cin>>n>>k;\n    vector<vector<int>>m(n,vector<int>(n));\n    for(int i=0;i<n;i++)for(int j=0;j<n;j++)cin>>m[i][j];\n    // Your code here\n    return 0;\n}',
      python: 'n,k=map(int,input().split())\nm=[list(map(int,input().split()))for _ in range(n)]\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,k]=lines[0].split(" ").map(Number);const m=[];for(let i=0;i<n;i++)m.push(lines[i+1].split(" ").map(Number));\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){int n,k;cin>>n>>k;vector<vector<int>>m(n,vector<int>(n));for(int i=0;i<n;i++)for(int j=0;j<n;j++)cin>>m[i][j];int lo=m[0][0],hi=m[n-1][n-1];while(lo<hi){int mid=lo+(hi-lo)/2;int cnt=0;int j=n-1;for(int i=0;i<n;i++){while(j>=0&&m[i][j]>mid)j--;cnt+=j+1;}if(cnt<k)lo=mid+1;else hi=mid;}cout<<lo;return 0;}',
      python: 'n,k=map(int,input().split())\nm=[list(map(int,input().split()))for _ in range(n)]\nlo,hi=m[0][0],m[n-1][n-1]\nwhile lo<hi:\n    mid=(lo+hi)//2\n    cnt=j=0;j=n-1\n    for i in range(n):\n        while j>=0 and m[i][j]>mid:j-=1\n        cnt+=j+1\n    if cnt<k:lo=mid+1\n    else:hi=mid\nprint(lo)',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,k]=lines[0].split(" ").map(Number);const m=[];for(let i=0;i<n;i++)m.push(lines[i+1].split(" ").map(Number));let lo=m[0][0],hi=m[n-1][n-1];while(lo<hi){const mid=Math.floor((lo+hi)/2);let cnt=0,j=n-1;for(let i=0;i<n;i++){while(j>=0&&m[i][j]>mid)j--;cnt+=j+1;}if(cnt<k)lo=mid+1;else hi=mid;}console.log(lo);'
    }
  },
  {
    title: 'Edit Distance', slug: 'edit-distance', difficulty: 'HARD',
    tags: ['dynamic-programming', 'strings'],
    statement: 'Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace a character) to convert word1 into word2.',
    inputFormat: 'First line: word1.\nSecond line: word2.',
    outputFormat: 'A single integer.',
    constraints: '0 ≤ |word1|, |word2| ≤ 500\nStrings contain lowercase English letters.',
    visibleSamples: [
      { input: 'horse\nros', output: '3', explanation: 'horse→rorse→rose→ros' },
      { input: 'intention\nexecution', output: '5' }
    ],
    hiddenTestCases: [
      { input: 'horse\nros', expectedOutput: '3' },
      { input: 'intention\nexecution', expectedOutput: '5' },
      { input: '\n', expectedOutput: '0' },
      { input: 'a\n', expectedOutput: '1' },
      { input: '\nb', expectedOutput: '1' },
      { input: 'abc\nabc', expectedOutput: '0' },
      { input: 'abc\ndef', expectedOutput: '3' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    string a,b;\n    getline(cin,a);getline(cin,b);\n    // Your code here\n    return 0;\n}',
      python: 'a=input()\nb=input()\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const a=lines[0]||"",b=lines[1]||"";\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){string a,b;getline(cin,a);getline(cin,b);int m=a.size(),n=b.size();vector<vector<int>>dp(m+1,vector<int>(n+1));for(int i=0;i<=m;i++)dp[i][0]=i;for(int j=0;j<=n;j++)dp[0][j]=j;for(int i=1;i<=m;i++)for(int j=1;j<=n;j++){if(a[i-1]==b[j-1])dp[i][j]=dp[i-1][j-1];else dp[i][j]=1+min({dp[i-1][j],dp[i][j-1],dp[i-1][j-1]});}cout<<dp[m][n];return 0;}',
      python: 'a=input()\nb=input()\nm,n=len(a),len(b)\ndp=[[0]*(n+1)for _ in range(m+1)]\nfor i in range(m+1):dp[i][0]=i\nfor j in range(n+1):dp[0][j]=j\nfor i in range(1,m+1):\n    for j in range(1,n+1):\n        if a[i-1]==b[j-1]:dp[i][j]=dp[i-1][j-1]\n        else:dp[i][j]=1+min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1])\nprint(dp[m][n])',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const a=lines[0]||"",b=lines[1]||"";const m=a.length,n=b.length;const dp=Array.from({length:m+1},()=>Array(n+1).fill(0));for(let i=0;i<=m;i++)dp[i][0]=i;for(let j=0;j<=n;j++)dp[0][j]=j;for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){if(a[i-1]===b[j-1])dp[i][j]=dp[i-1][j-1];else dp[i][j]=1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);}console.log(dp[m][n]);'
    }
  },
  {
    title: 'Merge K Sorted Lists', slug: 'merge-k-sorted-lists', difficulty: 'HARD',
    tags: ['heap', 'sorting', 'divide-and-conquer'],
    statement: 'Given k sorted arrays, merge them into one sorted array.',
    inputFormat: 'First line: k (number of arrays).\nNext k pairs of lines: first line is the size of the array, second line is the space-separated elements.',
    outputFormat: 'Space-separated elements of the merged sorted array.',
    constraints: '1 ≤ k ≤ 10^4\n0 ≤ total elements ≤ 10^4\n-10^4 ≤ element ≤ 10^4',
    visibleSamples: [
      { input: '3\n3\n1 4 5\n3\n1 3 4\n2\n2 6', output: '1 1 2 3 4 4 5 6' }
    ],
    hiddenTestCases: [
      { input: '3\n3\n1 4 5\n3\n1 3 4\n2\n2 6', expectedOutput: '1 1 2 3 4 4 5 6' },
      { input: '1\n0\n', expectedOutput: '' },
      { input: '2\n1\n1\n1\n2', expectedOutput: '1 2' },
      { input: '1\n3\n-1 0 1', expectedOutput: '-1 0 1' },
      { input: '3\n1\n5\n1\n3\n1\n1', expectedOutput: '1 3 5' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int k;cin>>k;\n    // Read k arrays\n    // Your code here\n    return 0;\n}',
      python: 'k=int(input())\n# Read k arrays and merge\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const k=+lines[0];\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){int k;cin>>k;priority_queue<int,vector<int>,greater<int>>pq;for(int i=0;i<k;i++){int sz;cin>>sz;for(int j=0;j<sz;j++){int x;cin>>x;pq.push(x);}}bool first=true;while(!pq.empty()){if(!first)cout<<" ";cout<<pq.top();pq.pop();first=false;}return 0;}',
      python: 'import heapq\nk=int(input())\nall=[]\nfor _ in range(k):\n    sz=int(input())\n    if sz>0:all.extend(map(int,input().split()))\n    else:input()\nheapq.heapify(all)\nres=[]\nwhile all:res.append(heapq.heappop(all))\nprint(" ".join(map(str,res)))',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const k=+lines[0];const all=[];let idx=1;for(let i=0;i<k;i++){const sz=+lines[idx++];if(sz>0&&lines[idx])all.push(...lines[idx].split(" ").map(Number));idx++;}all.sort((a,b)=>a-b);console.log(all.join(" "));'
    }
  },
]

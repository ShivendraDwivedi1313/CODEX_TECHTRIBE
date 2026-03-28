import { ProblemDef } from './index'

export const easyProblems: ProblemDef[] = [
  {
    title: 'Pair Sum Target', slug: 'pair-sum-target', difficulty: 'EASY',
    tags: ['arrays', 'hash-map'],
    statement: 'Given an array of integers `nums` and an integer `target`, find the indices of two numbers that add up to the target value. Each input has exactly one solution, and you cannot use the same element twice. Return the indices in any order.',
    inputFormat: 'First line: n (size of array) and target separated by space.\nSecond line: n space-separated integers.',
    outputFormat: 'Two space-separated indices (0-indexed).',
    constraints: '2 ≤ n ≤ 10^5\n-10^9 ≤ nums[i] ≤ 10^9\nExactly one valid answer exists.',
    visibleSamples: [
      { input: '4 9\n2 7 11 15', output: '0 1', explanation: 'nums[0]+nums[1]=2+7=9' },
      { input: '3 6\n3 2 4', output: '1 2' }
    ],
    hiddenTestCases: [
      { input: '4 9\n2 7 11 15', expectedOutput: '0 1' },
      { input: '3 6\n3 2 4', expectedOutput: '1 2' },
      { input: '2 6\n3 3', expectedOutput: '0 1' },
      { input: '5 8\n1 2 3 4 5', expectedOutput: '2 4' },
      { input: '4 0\n-1 0 1 2', expectedOutput: '0 2' },
      { input: '6 10\n5 5 3 7 1 9', expectedOutput: '0 1' },
      { input: '3 -1\n-3 2 0', expectedOutput: '0 1' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n, target;\n    cin >> n >> target;\n    vector<int> nums(n);\n    for(int i=0;i<n;i++) cin >> nums[i];\n    // Your code here\n    return 0;\n}',
      python: 'n, target = map(int, input().split())\nnums = list(map(int, input().split()))\n# Your code here',
      javascript: 'const [n, target] = require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n")[0].split(" ").map(Number);\nconst nums = require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n")[1].split(" ").map(Number);\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){int n,t;cin>>n>>t;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];unordered_map<int,int>m;for(int i=0;i<n;i++){if(m.count(t-a[i])){cout<<m[t-a[i]]<<" "<<i;return 0;}m[a[i]]=i;}return 0;}',
      python: 'n,target=map(int,input().split())\nnums=list(map(int,input().split()))\nd={}\nfor i,x in enumerate(nums):\n    if target-x in d:\n        print(d[target-x],i);break\n    d[x]=i',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,t]=lines[0].split(" ").map(Number);const a=lines[1].split(" ").map(Number);const m={};for(let i=0;i<n;i++){if(m[t-a[i]]!==undefined){console.log(m[t-a[i]]+" "+i);break;}m[a[i]]=i;}'
    }
  },
  {
    title: 'Palindrome Check', slug: 'palindrome-check', difficulty: 'EASY',
    tags: ['strings', 'two-pointers'],
    statement: 'Given a string `s`, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases. Return "YES" if it is a palindrome, "NO" otherwise.',
    inputFormat: 'A single line containing the string s.',
    outputFormat: '"YES" or "NO".',
    constraints: '1 ≤ |s| ≤ 2×10^5\ns consists of printable ASCII characters.',
    visibleSamples: [
      { input: 'A man a plan a canal Panama', output: 'YES' },
      { input: 'race a car', output: 'NO' }
    ],
    hiddenTestCases: [
      { input: 'A man a plan a canal Panama', expectedOutput: 'YES' },
      { input: 'race a car', expectedOutput: 'NO' },
      { input: 'a', expectedOutput: 'YES' },
      { input: '', expectedOutput: 'YES' },
      { input: 'ab', expectedOutput: 'NO' },
      { input: 'aba', expectedOutput: 'YES' },
      { input: '0P', expectedOutput: 'NO' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    string s;\n    getline(cin,s);\n    // Your code here\n    return 0;\n}',
      python: 's = input()\n# Your code here',
      javascript: 'const s=require("fs").readFileSync("/dev/stdin","utf8").trim();\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){string s;getline(cin,s);string f;for(char c:s)if(isalnum(c))f+=tolower(c);int l=0,r=f.size()-1;while(l<r){if(f[l]!=f[r]){cout<<"NO";return 0;}l++;r--;}cout<<"YES";return 0;}',
      python: 's=input()\nf="".join(c.lower() for c in s if c.isalnum())\nprint("YES" if f==f[::-1] else "NO")',
      javascript: 'const s=require("fs").readFileSync("/dev/stdin","utf8").trim();const f=s.replace(/[^a-zA-Z0-9]/g,"").toLowerCase();console.log(f===f.split("").reverse().join("")?"YES":"NO");'
    }
  },
  {
    title: 'Binary Search', slug: 'binary-search', difficulty: 'EASY',
    tags: ['binary-search', 'arrays'],
    statement: 'Given a sorted array of distinct integers and a target value, return the index of the target if found, or -1 if not present.',
    inputFormat: 'First line: n and target.\nSecond line: n sorted space-separated integers.',
    outputFormat: 'A single integer: index (0-indexed) or -1.',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ nums[i], target ≤ 10^9',
    visibleSamples: [
      { input: '6 9\n-1 0 3 5 9 12', output: '4' },
      { input: '6 2\n-1 0 3 5 9 12', output: '-1' }
    ],
    hiddenTestCases: [
      { input: '6 9\n-1 0 3 5 9 12', expectedOutput: '4' },
      { input: '6 2\n-1 0 3 5 9 12', expectedOutput: '-1' },
      { input: '1 5\n5', expectedOutput: '0' },
      { input: '1 3\n5', expectedOutput: '-1' },
      { input: '5 1\n1 2 3 4 5', expectedOutput: '0' },
      { input: '5 5\n1 2 3 4 5', expectedOutput: '4' },
      { input: '3 2\n1 2 3', expectedOutput: '1' },
      // Broader coverage tests
      { input: '10 7\n1 2 3 4 5 6 7 8 9 10', expectedOutput: '6' },
      { input: '10 1\n1 2 3 4 5 6 7 8 9 10', expectedOutput: '0' },
      { input: '10 10\n1 2 3 4 5 6 7 8 9 10', expectedOutput: '9' },
      { input: '10 0\n1 2 3 4 5 6 7 8 9 10', expectedOutput: '-1' },
      { input: '8 15\n2 5 8 12 15 18 22 30', expectedOutput: '4' },
      { input: '8 1\n2 5 8 12 15 18 22 30', expectedOutput: '-1' },
      { input: '2 1\n1 2', expectedOutput: '0' },
      { input: '2 2\n1 2', expectedOutput: '1' },
      { input: '2 3\n1 2', expectedOutput: '-1' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n,t;cin>>n>>t;\n    vector<int>a(n);\n    for(int i=0;i<n;i++)cin>>a[i];\n    // Your code here\n    return 0;\n}',
      python: 'n, target = map(int, input().split())\nnums = list(map(int, input().split()))\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,t]=lines[0].split(" ").map(Number);const a=lines[1].split(" ").map(Number);\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){int n,t;cin>>n>>t;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];int l=0,r=n-1;while(l<=r){int m=(l+r)/2;if(a[m]==t){cout<<m;return 0;}else if(a[m]<t)l=m+1;else r=m-1;}cout<<-1;return 0;}',
      python: 'n,t=map(int,input().split())\na=list(map(int,input().split()))\nl,r=0,n-1\nans=-1\nwhile l<=r:\n    m=(l+r)//2\n    if a[m]==t:ans=m;break\n    elif a[m]<t:l=m+1\n    else:r=m-1\nprint(ans)',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[n,t]=lines[0].split(" ").map(Number);const a=lines[1].split(" ").map(Number);let l=0,r=n-1,ans=-1;while(l<=r){const m=(l+r)>>1;if(a[m]===t){ans=m;break;}else if(a[m]<t)l=m+1;else r=m-1;}console.log(ans);'
    }
  },
  {
    title: 'Majority Element', slug: 'majority-element', difficulty: 'EASY',
    tags: ['arrays', 'voting-algorithm'],
    statement: 'Given an array of n integers, find the element that appears more than ⌊n/2⌋ times. You may assume such an element always exists.',
    inputFormat: 'First line: n.\nSecond line: n space-separated integers.',
    outputFormat: 'A single integer: the majority element.',
    constraints: '1 ≤ n ≤ 5×10^4\n-10^9 ≤ nums[i] ≤ 10^9',
    visibleSamples: [
      { input: '3\n3 2 3', output: '3' },
      { input: '7\n2 2 1 1 1 2 2', output: '2' }
    ],
    hiddenTestCases: [
      { input: '3\n3 2 3', expectedOutput: '3' },
      { input: '7\n2 2 1 1 1 2 2', expectedOutput: '2' },
      { input: '1\n1', expectedOutput: '1' },
      { input: '5\n5 5 5 1 2', expectedOutput: '5' },
      { input: '3\n-1 -1 2', expectedOutput: '-1' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n;cin>>n;\n    vector<int>a(n);\n    for(int i=0;i<n;i++)cin>>a[i];\n    // Your code here\n    return 0;\n}',
      python: 'n=int(input())\nnums=list(map(int,input().split()))\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const n=+lines[0];const a=lines[1].split(" ").map(Number);\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){int n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];int c=0,cand=0;for(int x:a){if(c==0)cand=x;c+=(x==cand)?1:-1;}cout<<cand;return 0;}',
      python: 'n=int(input())\na=list(map(int,input().split()))\nc=0;cand=0\nfor x in a:\n    if c==0:cand=x\n    c+=1 if x==cand else -1\nprint(cand)',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const a=lines[1].split(" ").map(Number);let c=0,cand=0;for(const x of a){if(c===0)cand=x;c+=x===cand?1:-1;}console.log(cand);'
    }
  },
  {
    title: 'Valid Brackets', slug: 'valid-brackets', difficulty: 'EASY',
    tags: ['stack', 'strings'],
    statement: 'Given a string containing only the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. A string is valid if open brackets are closed by the same type in the correct order, and every close bracket has a corresponding open bracket.',
    inputFormat: 'A single line with the bracket string.',
    outputFormat: '"YES" if valid, "NO" otherwise.',
    constraints: '0 ≤ |s| ≤ 10^4',
    visibleSamples: [
      { input: '()', output: 'YES' },
      { input: '()[]{}', output: 'YES' },
      { input: '(]', output: 'NO' }
    ],
    hiddenTestCases: [
      { input: '()', expectedOutput: 'YES' },
      { input: '()[]{}', expectedOutput: 'YES' },
      { input: '(]', expectedOutput: 'NO' },
      { input: '', expectedOutput: 'YES' },
      { input: '([)]', expectedOutput: 'NO' },
      { input: '{[]}', expectedOutput: 'YES' },
      { input: '((()))', expectedOutput: 'YES' },
      { input: '(', expectedOutput: 'NO' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    string s;getline(cin,s);\n    // Your code here\n    return 0;\n}',
      python: 's=input()\n# Your code here',
      javascript: 'const s=require("fs").readFileSync("/dev/stdin","utf8").trim();\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){string s;getline(cin,s);stack<char>st;for(char c:s){if(c==\'(\'||c==\'[\'||c==\'{\')st.push(c);else{if(st.empty()){cout<<"NO";return 0;}char t=st.top();st.pop();if((c==\')\'&&t!=\'(\')||(c==\']\'&&t!=\'[\')||(c==\'}\'&&t!=\'{\')){cout<<"NO";return 0;}}}cout<<(st.empty()?"YES":"NO");return 0;}',
      python: 's=input()\nst=[]\nm={")":"(","]":"[","}":"{"}\nfor c in s:\n    if c in "([{":\n        st.append(c)\n    else:\n        if not st or st[-1]!=m[c]:\n            print("NO");exit()\n        st.pop()\nprint("YES" if not st else "NO")',
      javascript: 'const s=require("fs").readFileSync("/dev/stdin","utf8").trim();const st=[];const m={")":"(","]":"[","}":"{"};for(const c of s){if("([{".includes(c))st.push(c);else{if(!st.length||st[st.length-1]!==m[c]){console.log("NO");process.exit();}st.pop();}}console.log(st.length===0?"YES":"NO");'
    }
  },
  {
    title: 'Max Depth of Binary Tree', slug: 'max-depth-binary-tree', difficulty: 'EASY',
    tags: ['trees', 'recursion', 'bfs'],
    statement: 'Given a binary tree represented as a level-order array (using -1 for null nodes), find its maximum depth. The depth is the number of nodes along the longest path from root to the farthest leaf.',
    inputFormat: 'First line: n (number of elements in level-order).\nSecond line: n space-separated integers (-1 for null).',
    outputFormat: 'A single integer: the maximum depth.',
    constraints: '0 ≤ n ≤ 10^4',
    visibleSamples: [
      { input: '5\n3 9 20 -1 -1', output: '2' },
      { input: '7\n3 9 20 -1 -1 15 7', output: '3' }
    ],
    hiddenTestCases: [
      { input: '5\n3 9 20 -1 -1', expectedOutput: '2' },
      { input: '7\n3 9 20 -1 -1 15 7', expectedOutput: '3' },
      { input: '1\n1', expectedOutput: '1' },
      { input: '0\n', expectedOutput: '0' },
      { input: '3\n1 2 -1', expectedOutput: '2' },
      { input: '15\n1 2 3 4 5 -1 -1 -1 -1 6 -1 -1 -1 -1 -1', expectedOutput: '4' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n;cin>>n;\n    vector<int>a(n);\n    for(int i=0;i<n;i++)cin>>a[i];\n    // Build tree and find max depth\n    return 0;\n}',
      python: 'n=int(input())\nif n>0:\n    a=list(map(int,input().split()))\nelse:\n    input();a=[]\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const n=+lines[0];const a=n>0?lines[1].split(" ").map(Number):[];\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){int n;cin>>n;if(n==0){cout<<0;return 0;}vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];if(a[0]==-1){cout<<0;return 0;}queue<int>q;q.push(0);int d=0;while(!q.empty()){int sz=q.size();d++;for(int i=0;i<sz;i++){int x=q.front();q.pop();int l=2*x+1,r=2*x+2;if(l<n&&a[l]!=-1)q.push(l);if(r<n&&a[r]!=-1)q.push(r);}}cout<<d;return 0;}',
      python: 'n=int(input())\nif n==0:\n    input() if True else None\n    print(0);exit()\ntry:\n    a=list(map(int,input().split()))\nexcept:a=[]\nif not a or a[0]==-1:print(0);exit()\nfrom collections import deque\nq=deque([0]);d=0\nwhile q:\n    d+=1\n    for _ in range(len(q)):\n        x=q.popleft()\n        l,r=2*x+1,2*x+2\n        if l<n and a[l]!=-1:q.append(l)\n        if r<n and a[r]!=-1:q.append(r)\nprint(d)',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const n=+lines[0];if(n===0){console.log(0);process.exit();}const a=lines[1].split(" ").map(Number);if(a[0]===-1){console.log(0);process.exit();}let q=[0],d=0;while(q.length){d++;const nq=[];for(const x of q){const l=2*x+1,r=2*x+2;if(l<n&&a[l]!==-1)nq.push(l);if(r<n&&a[r]!==-1)nq.push(r);}q=nq;}console.log(d);'
    }
  },
  {
    title: 'Flood Fill', slug: 'flood-fill', difficulty: 'EASY',
    tags: ['dfs', 'bfs', 'matrix'],
    statement: 'Given an m×n grid of integers, a starting cell (sr, sc), and a new color, perform a flood fill. Change the color of the starting cell and all connected cells (4-directionally) that share the same original color to the new color. Print the modified grid.',
    inputFormat: 'First line: m n sr sc newColor.\nNext m lines: n space-separated integers (the grid).',
    outputFormat: 'm lines of n space-separated integers (modified grid).',
    constraints: '1 ≤ m, n ≤ 50\n0 ≤ sr < m, 0 ≤ sc < n\n0 ≤ grid[i][j], newColor ≤ 65535',
    visibleSamples: [
      { input: '3 3 1 1 2\n1 1 1\n1 1 0\n1 0 1', output: '2 2 2\n2 2 0\n2 0 1' }
    ],
    hiddenTestCases: [
      { input: '3 3 1 1 2\n1 1 1\n1 1 0\n1 0 1', expectedOutput: '2 2 2\n2 2 0\n2 0 1' },
      { input: '1 1 0 0 2\n0', expectedOutput: '2' },
      { input: '3 3 0 0 0\n0 0 0\n0 0 0\n0 0 0', expectedOutput: '0 0 0\n0 0 0\n0 0 0' },
      { input: '2 2 0 0 3\n1 2\n2 1', expectedOutput: '3 2\n2 1' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int m,n,sr,sc,nc;\n    cin>>m>>n>>sr>>sc>>nc;\n    vector<vector<int>>g(m,vector<int>(n));\n    for(int i=0;i<m;i++)for(int j=0;j<n;j++)cin>>g[i][j];\n    // Your code here\n    return 0;\n}',
      python: 'm,n,sr,sc,nc=map(int,input().split())\ng=[list(map(int,input().split()))for _ in range(m)]\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[m,n,sr,sc,nc]=lines[0].split(" ").map(Number);const g=[];for(let i=0;i<m;i++)g.push(lines[i+1].split(" ").map(Number));\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint m,n;void dfs(vector<vector<int>>&g,int r,int c,int oc,int nc){if(r<0||r>=m||c<0||c>=n||g[r][c]!=oc)return;g[r][c]=nc;dfs(g,r+1,c,oc,nc);dfs(g,r-1,c,oc,nc);dfs(g,r,c+1,oc,nc);dfs(g,r,c-1,oc,nc);}int main(){int sr,sc,nc;cin>>m>>n>>sr>>sc>>nc;vector<vector<int>>g(m,vector<int>(n));for(int i=0;i<m;i++)for(int j=0;j<n;j++)cin>>g[i][j];if(g[sr][sc]!=nc)dfs(g,sr,sc,g[sr][sc],nc);for(int i=0;i<m;i++){for(int j=0;j<n;j++){if(j)cout<<" ";cout<<g[i][j];}cout<<"\\n";}return 0;}',
      python: 'import sys\nsys.setrecursionlimit(10000)\nm,n,sr,sc,nc=map(int,input().split())\ng=[list(map(int,input().split()))for _ in range(m)]\ndef dfs(r,c,oc):\n    if r<0 or r>=m or c<0 or c>=n or g[r][c]!=oc:return\n    g[r][c]=nc\n    dfs(r+1,c,oc);dfs(r-1,c,oc);dfs(r,c+1,oc);dfs(r,c-1,oc)\nif g[sr][sc]!=nc:dfs(sr,sc,g[sr][sc])\nfor row in g:print(" ".join(map(str,row)))',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const[m,n,sr,sc,nc]=lines[0].split(" ").map(Number);const g=[];for(let i=0;i<m;i++)g.push(lines[i+1].split(" ").map(Number));function dfs(r,c,oc){if(r<0||r>=m||c<0||c>=n||g[r][c]!==oc)return;g[r][c]=nc;dfs(r+1,c,oc);dfs(r-1,c,oc);dfs(r,c+1,oc);dfs(r,c-1,oc);}if(g[sr][sc]!==nc)dfs(sr,sc,g[sr][sc]);for(let i=0;i<m;i++)console.log(g[i].join(" "));'
    }
  },
  {
    title: 'Min Stack', slug: 'min-stack', difficulty: 'EASY',
    tags: ['stack', 'design'],
    statement: 'Implement a stack that supports push, pop, top, and retrieving the minimum element, all in O(1) time. Process q operations:\n- "push x": push x onto the stack\n- "pop": remove the top element\n- "top": print the top element\n- "getMin": print the minimum element',
    inputFormat: 'First line: q (number of operations).\nNext q lines: one operation per line.',
    outputFormat: 'For each "top" or "getMin" operation, print the result on a new line.',
    constraints: '1 ≤ q ≤ 10^5\n-10^9 ≤ x ≤ 10^9\npop, top, getMin are only called on non-empty stacks.',
    visibleSamples: [
      { input: '6\npush -2\npush 0\npush -3\ngetMin\npop\ntop', output: '-3\n-2' }
    ],
    hiddenTestCases: [
      { input: '6\npush -2\npush 0\npush -3\ngetMin\npop\ntop', expectedOutput: '-3\n-2' },
      { input: '4\npush 1\npush 2\ntop\ngetMin', expectedOutput: '2\n1' },
      { input: '8\npush 5\npush 3\npush 7\ngetMin\npop\ngetMin\npop\ngetMin', expectedOutput: '3\n3\n5' },
      { input: '5\npush 0\npush 0\npush 0\ngetMin\ntop', expectedOutput: '0\n0' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int q;cin>>q;\n    // Your code here\n    return 0;\n}',
      python: 'q=int(input())\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const q=+lines[0];\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){int q;cin>>q;stack<pair<int,int>>st;while(q--){string op;cin>>op;if(op=="push"){int x;cin>>x;int mn=st.empty()?x:min(x,st.top().second);st.push({x,mn});}else if(op=="pop"){st.pop();}else if(op=="top"){cout<<st.top().first<<"\\n";}else{cout<<st.top().second<<"\\n";}}return 0;}',
      python: 'q=int(input())\nst=[]\nfor _ in range(q):\n    line=input().split()\n    if line[0]=="push":\n        x=int(line[1])\n        mn=min(x,st[-1][1]) if st else x\n        st.append((x,mn))\n    elif line[0]=="pop":st.pop()\n    elif line[0]=="top":print(st[-1][0])\n    else:print(st[-1][1])',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const q=+lines[0];const st=[];const out=[];for(let i=1;i<=q;i++){const p=lines[i].split(" ");if(p[0]==="push"){const x=+p[1];const mn=st.length?Math.min(x,st[st.length-1][1]):x;st.push([x,mn]);}else if(p[0]==="pop")st.pop();else if(p[0]==="top")out.push(st[st.length-1][0]);else out.push(st[st.length-1][1]);}console.log(out.join("\\n"));'
    }
  },
  {
    title: 'Staircase Climber', slug: 'staircase-climber', difficulty: 'EASY',
    tags: ['dynamic-programming'],
    statement: 'You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you reach the top? Print the answer modulo 10^9+7.',
    inputFormat: 'A single integer n.',
    outputFormat: 'A single integer: number of ways mod 10^9+7.',
    constraints: '1 ≤ n ≤ 10^6',
    visibleSamples: [
      { input: '2', output: '2', explanation: '1+1 or 2' },
      { input: '3', output: '3', explanation: '1+1+1, 1+2, 2+1' }
    ],
    hiddenTestCases: [
      { input: '2', expectedOutput: '2' },
      { input: '3', expectedOutput: '3' },
      { input: '1', expectedOutput: '1' },
      { input: '5', expectedOutput: '8' },
      { input: '10', expectedOutput: '89' },
      { input: '45', expectedOutput: '1836311903' },
      { input: '1000000', expectedOutput: '21' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n;cin>>n;\n    // Your code here\n    return 0;\n}',
      python: 'n=int(input())\n# Your code here',
      javascript: 'const n=+require("fs").readFileSync("/dev/stdin","utf8").trim();\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nconst int MOD=1e9+7;int main(){int n;cin>>n;if(n<=2){cout<<n;return 0;}long long a=1,b=2;for(int i=3;i<=n;i++){long long c=(a+b)%MOD;a=b;b=c;}cout<<b;return 0;}',
      python: 'n=int(input())\nMOD=10**9+7\nif n<=2:print(n);exit()\na,b=1,2\nfor _ in range(3,n+1):a,b=b,(a+b)%MOD\nprint(b)',
      javascript: 'const n=+require("fs").readFileSync("/dev/stdin","utf8").trim();const MOD=1000000007n;if(n<=2){console.log(n);}else{let a=1n,b=2n;for(let i=3;i<=n;i++){const c=(a+b)%MOD;a=b;b=c;}console.log(b.toString());}'
    }
  },
  {
    title: 'Maximum Subarray Sum', slug: 'maximum-subarray-sum', difficulty: 'EASY',
    tags: ['arrays', 'dynamic-programming', 'kadane'],
    statement: 'Given an integer array, find the contiguous subarray (containing at least one element) which has the largest sum and return that sum.',
    inputFormat: 'First line: n.\nSecond line: n space-separated integers.',
    outputFormat: 'A single integer: the maximum subarray sum.',
    constraints: '1 ≤ n ≤ 10^5\n-10^4 ≤ nums[i] ≤ 10^4',
    visibleSamples: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: 'Subarray [4,-1,2,1] has sum 6' },
      { input: '1\n1', output: '1' }
    ],
    hiddenTestCases: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6' },
      { input: '1\n1', expectedOutput: '1' },
      { input: '5\n5 4 -1 7 8', expectedOutput: '23' },
      { input: '1\n-1', expectedOutput: '-1' },
      { input: '3\n-2 -1 -3', expectedOutput: '-1' },
      { input: '4\n1 2 3 4', expectedOutput: '10' },
    ],
    starterCode: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n;cin>>n;\n    vector<int>a(n);\n    for(int i=0;i<n;i++)cin>>a[i];\n    // Your code here\n    return 0;\n}',
      python: 'n=int(input())\na=list(map(int,input().split()))\n# Your code here',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const n=+lines[0];const a=lines[1].split(" ").map(Number);\n// Your code here'
    },
    referenceSolution: {
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){int n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];int mx=a[0],cur=a[0];for(int i=1;i<n;i++){cur=max(a[i],cur+a[i]);mx=max(mx,cur);}cout<<mx;return 0;}',
      python: 'n=int(input())\na=list(map(int,input().split()))\nmx=cur=a[0]\nfor x in a[1:]:\n    cur=max(x,cur+x)\n    mx=max(mx,cur)\nprint(mx)',
      javascript: 'const lines=require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");const a=lines[1].split(" ").map(Number);let mx=a[0],cur=a[0];for(let i=1;i<a.length;i++){cur=Math.max(a[i],cur+a[i]);mx=Math.max(mx,cur);}console.log(mx);'
    }
  },
]

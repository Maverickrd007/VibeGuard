import { fetchApi } from '../config';
import { useState, useEffect } from 'react';
import { FolderGit2, ExternalLink, Calendar, GitFork } from 'lucide-react';
import { toast } from 'sonner';

export function Repositories() {
  const [repositories, setRepositories] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/api/repositories')
      .then(res => res.json())
      .then(data => {
        setRepositories(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="bg-[#0D1017]/80 backdrop-blur-md shadow-xl rounded-xl border border-gray-800/80 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-800/80 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-white">Monitored Repositories</h3>
          <p className="text-xs text-gray-400 mt-0.5">Manage and view integrated Git repositories being scanned.</p>
        </div>
        <button onClick={() => toast('GitHub Integration', { description: 'Opening OAuth popup to select repositories...' })} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black px-4 py-2 rounded-lg text-xs font-semibold shadow-lg shadow-cyan-500/10 transition-all cursor-pointer">
          Connect Repository
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repositories.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed border-gray-800 rounded-xl">
            <FolderGit2 className="h-10 w-10 text-gray-700 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-white">No repositories connected</h4>
            <p className="text-xs text-gray-500 mt-1 mb-4">Run a CLI scan or connect a repository to see it here.</p>
          </div>
        ) : (
          repositories.map((repo) => (
            <div key={repo.id} className="bg-[#0A0D14] border border-gray-800/80 rounded-xl p-5 hover:border-cyan-500/40 transition-colors group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/10 transition-all" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-800/50 text-gray-300">
                    <FolderGit2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">{repo.name}</h4>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                      <GitFork className="h-3 w-3" /> main
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t border-gray-800/60">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Added</span>
                  <span className="text-gray-300 font-mono">{new Date(repo.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Source</span>
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    {repo.url} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

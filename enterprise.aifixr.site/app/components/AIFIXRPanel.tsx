'use client';

import { X, Bot, Send, MessageSquare, History, FolderOpen } from 'lucide-react';
import { useState } from 'react';

interface AIFIXRPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'chat' | 'history' | 'library';

interface ChatHistory {
  id: string;
  title: string;
  date: string;
  preview: string;
}

interface Project {
  id: string;
  name: string;
  chatCount: number;
  lastActive: string;
}

export default function AIFIXRPanel({ isOpen, onClose }: AIFIXRPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'assistant' | 'user'; content: string }>>([
    {
      role: 'assistant',
      content: '안녕하세요! AIFIXR Assistant입니다. ESG 관련 질문이나 문서 윤문, 요약 등을 도와드립니다.'
    }
  ]);
  
  // 히스토리 데이터 (예시)
  const [chatHistory] = useState<ChatHistory[]>([
    { id: '1', title: 'ESG 보고서 작성 문의', date: '2025-01-15', preview: 'ESG 보고서 작성 방법에 대해 문의드립니다...' },
    { id: '2', title: '문서 윤문 요청', date: '2025-01-14', preview: '다음 문서의 윤문을 부탁드립니다...' },
    { id: '3', title: 'ESG 등급 확인', date: '2025-01-13', preview: '우리 회사의 ESG 등급을 확인하고 싶습니다...' },
  ]);

  // 라이브러리 프로젝트 데이터 (예시)
  const [projects] = useState<Project[]>([
    { id: '1', name: '2025 ESG 보고서', chatCount: 12, lastActive: '2025-01-15' },
    { id: '2', name: '지속가능경영 전략', chatCount: 8, lastActive: '2025-01-14' },
    { id: '3', name: '탄소중립 계획', chatCount: 5, lastActive: '2025-01-13' },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setChatMessages([...chatMessages, { role: 'user', content: message }]);
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: '죄송합니다. 현재 데모 버전입니다. 실제 서비스에서는 AI가 답변을 제공합니다.'
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-screen z-50 w-[500px] transition-all duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col shadow-2xl backdrop-blur-[20px] bg-white border-l border-gray-200/50">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    AIFIXR Assistant
                  </h3>
                  <p className="text-white/80 text-xs">
                    온라인
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'chat'
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">채팅</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'history'
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <History className="w-4 h-4" />
                <span className="text-sm">히스토리</span>
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'library'
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                <span className="text-sm">라이브러리</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeTab === 'chat' && (
              <>
                {/* Chat Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="메시지를 입력하세요..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3BFA] focus:border-transparent"
                    />
                    <button
                      onClick={handleSend}
                      className="p-3 bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'history' && (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-3">
                  {chatHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-500 mb-2">{item.preview}</p>
                      <p className="text-xs text-gray-400">{item.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'library' && (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <h4 className="font-medium text-gray-900 mb-1">{project.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{project.chatCount}개 대화</span>
                        <span>•</span>
                        <span>최근 활동: {project.lastActive}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


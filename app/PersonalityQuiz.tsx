'use client'
import React, { FormEvent, useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Check, Share2, Reply, Sparkles, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '@/interface/Question';
import { Location } from '@/interface/Location';
import ProgressBar from './ProgressBar';
import { getMatchLocation } from '@/functions/Submit';
import Image from 'next/image';

interface PersonalityQuizProps {
  data: {
    questions: Question[];
    locations: Location[];
    visits: number;
  }
}

interface QuizState {
  step: 'welcome' | 'quiz' | 'result';
  nickname: string;
  currentQuestion: number;
  answers: number[];
  matchedLocation: Location | null;
}

const PersonalityQuiz: React.FC<PersonalityQuizProps> = ({ data }) => {
  const [quizState, setQuizState] = useState<QuizState>({
    step: 'welcome',
    nickname: '',
    currentQuestion: 0,
    answers: [],
    matchedLocation: null
  });
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions = data.questions.length;
  const progress = ((quizState.currentQuestion + 1) / totalQuestions) * 100;

  const handleStartQuiz = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (quizState.nickname.trim()) {
      setQuizState(prev => ({ ...prev, step: 'quiz' }));
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `มาลองตามหาตัวตนของเราเป็นสถานที่อารัยยในภข 🔬✨`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'ค้นหาตัวตนเราเป็นสถานที่อารัยยยย',
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAnswer = async (optionId: number) => {
    if (isSubmitting) return;

    const newAnswers = [...quizState.answers, optionId];
    const isLastQuestion = quizState.currentQuestion === totalQuestions - 1;

    if (isLastQuestion) {
      setIsSubmitting(true);
      try {
        const userAgent = navigator.userAgent;
        const ipAddress = await fetch('https://api.ipify.org?format=json')
          .then(res => res.json())
          .then(data => data.ip);

        const matchedLocation = await getMatchLocation({
          locations: newAnswers,
          nickname: quizState.nickname,
          userAgent,
          ipAddress
        });

        setQuizState(prev => ({
          ...prev,
          answers: newAnswers,
          matchedLocation,
          step: 'result'
        }));
      } catch (error) {
        console.error("Error processing results:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setQuizState(prev => ({
        ...prev,
        answers: newAnswers,
        currentQuestion: prev.currentQuestion + 1
      }));
    }
  };

  const resetQuiz = () => {
    setQuizState({
      step: 'welcome',
      nickname: '',
      currentQuestion: 0,
      answers: [],
      matchedLocation: null
    });
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const renderWelcome = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl px-4 py-8"
    >
      <Card className="shadow-xl border-2 border-pink-200 relative overflow-hidden bg-gradient-to-b from-pink-50 to-white">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-200 via-purple-200 to-pink-200" />
        <motion.div
          className="absolute top-4 right-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-6 h-6 text-pink-400" />
        </motion.div>

        <CardContent className="md:p-8 p-4">
          <motion.div
            className="text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <div className="relative">
              <motion.div
                className="-top-1 -right-1 w-full h-full"
                animate={{ rotate: [-2, 2] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <Image
                  src="/logo_wbn.png"
                  className="mx-auto mb-6 rounded-2xl shadow-lg"
                  alt="logo"
                  width={192}
                  height={192}
                />
              </motion.div>
            </div>

            <motion.h1
              className="text-xl font-bold text-gray-800 mb-4 mt-6"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              มาทดสอบตัวตนตัวเองก๊านน
              <span className="block text-pink-500">เป็นสถานที่ไหนในภข.</span>
            </motion.h1>

            <p className="text-gray-600 text-lg mb-8">
              มาดูกันว่าไทป์ของเราตรงสถานที่ไหนในโรงเรียน!
              <Heart className="inline-block ml-2 w-5 h-5 text-pink-400" />
            </p>

            <form onSubmit={handleStartQuiz} className="space-y-6">
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.02 }}
              >
                <input
                  type="text"
                  value={quizState.nickname}
                  onChange={(e) => setQuizState(prev => ({ ...prev, nickname: e.target.value }))}
                  placeholder="นามแฝงของคุณ"
                  className="w-full p-4 text-lg border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 pl-12 transition-all duration-300 placeholder:text-gray-400"
                  required
                />
                <User className="w-6 h-6 text-pink-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full text-xl bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white py-6 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>ไปกันต่อออ</span>
                  <Sparkles className="w-6 h-6" />
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </CardContent>

        <CardFooter className="pb-6">
          <div className="w-full text-center">
            <motion.p
              className="text-gray-600 text-lg font-medium"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ยอดเข้าเล่น: <span className="text-pink-500 font-bold">{data.visits}</span>
            </motion.p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );

  const renderQuiz = () => (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="flex justify-center mb-4"
          animate={floatingAnimation}
        >
          <Image src={`/logo_wbn.png`} alt='logo' width={128} height={128} quality={100} />
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={quizState.currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-lg border-2 border-pink-200 text-center relative overflow-hidden">
            <CardContent className="p-6">
              <div className="mb-6">
                <ProgressBar
                  value={progress}
                  total={totalQuestions}
                  current={quizState.currentQuestion + 1}
                />
                <motion.p
                  className="text-sm text-gray-500 mt-2 text-right"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {quizState.currentQuestion + 1} / {totalQuestions}
                </motion.p>
              </div>

              <div className="mb-8">
                <motion.h2
                  className="text-xl font-semibold text-gray-800 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  คำถามที่ {quizState.currentQuestion + 1}: {data.questions[quizState.currentQuestion].text}
                </motion.h2>

                <div className="space-y-4">
                  {data.questions[quizState.currentQuestion].options.map((option, index) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full p-4 hover:bg-pink-50 hover:border-pink-300 transition-all break-words whitespace-normal"
                        onClick={() => handleAnswer(option.id)}
                        disabled={isSubmitting}
                      >
                        {option.text}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  const renderResult = () => (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", bounce: 0.4 }}
      className="w-full max-w-3xl mx-auto px-4"
    >
      <Card className="shadow-xl border-2 border-pink-200 text-center relative overflow-hidden bg-white/95 backdrop-blur-sm">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-200 via-purple-200 to-pink-200" />

        {/* Decorative corner sparkles */}
        <motion.div
          className="absolute top-4 right-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-6 h-6 text-pink-400" />
        </motion.div>

        <CardContent className="p-6 sm:p-10 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Result Header */}
            <div className="space-y-3">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold">
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    คุณ{quizState.nickname} คือ...
                  </span>
                </h2>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mt-2">
                  {quizState.matchedLocation?.topic}
                </h3>
              </motion.div>
            </div>

            {/* Result Image */}
            <motion.div
              className="relative"
              animate={floatingAnimation}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-pink-200 to-purple-200 opacity-20 rounded-xl blur-xl" />
              <Image
                src={`/locations/${quizState.matchedLocation?.image || ''}`}
                alt={quizState.matchedLocation?.name || ''}
                className="relative rounded-xl shadow-lg mx-auto object-cover"
                width={256}
                height={256}
              />
            </motion.div>

            {/* Description */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-md text-gray-600 leading-relaxed">
                {quizState.matchedLocation?.description}
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col gap-3 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleShare}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 text-lg flex items-center justify-center gap-2 rounded-xl shadow-lg"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>คัดลอกลิ้งค์แล้ว!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5" />
                      <span>แชร์ให้เพื่อนเล่นด้วย</span>
                    </>
                  )}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white p-6 text-lg flex items-center justify-center gap-2 rounded-xl shadow-lg"
                  onClick={resetQuiz}
                >
                  <Reply className="w-5 h-5" />
                  <span>เล่นอีกรอบ</span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </CardContent>

        <CardFooter className="pb-6">
          <div className="w-full text-center">
            <motion.p
              className="text-gray-600 text-base flex items-center justify-center gap-2"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ทำโดย นักเรียนคนนึงในภข.
            </motion.p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 via-blue-50 to-yellow-50 p-2">
      {quizState.step === 'welcome' && renderWelcome()}
      {quizState.step === 'quiz' && renderQuiz()}
      {quizState.step === 'result' && renderResult()}
    </div>
  );
};

export default PersonalityQuiz;
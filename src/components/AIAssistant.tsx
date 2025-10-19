// AIAssistant.tsx - إصدار بدون اتصال بالإنترنت
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles,componentStyles } from '../styles';
import { colors } from '../styles/colors';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIAssistantProps {
  visible: boolean;
  onClose: () => void;
}

// قاعدة المعرفة للمساعد الذكي
const knowledgeBase = {
  'نقل ملكية': {
    answer: `🔄 **نقل ملكية المركبة**\n\n• السعر: 420 ريال\n• المدة: 20 دقيقة عمل\n• المستندات المطلوبة:\n  - استمارة المركبة\n  - هوية البائع والمشتري\n  - تأمين ساري\n  - فحص فني ساري\n  - سداد المخالفات\n\n🎯 للمباشرة: اذهب لشاشة "نقل ملكية"`,
    keywords: ['نقل', 'ملكية', 'تحويل', 'بيع', 'شراء']
  },
  'تأمين': {
    answer: `🛡️ **التأمين على المركبة**\n\nأنواع التأمين:\n• تأمين شامل - أعلى حماية\n• تأمين ضد الغير - إلزامي\n\n📞 للاستفسار: اتصل بشركات التأمين المعتمدة\n\nنصيحة: ⏰ لا تنتظر انتهاء التأمين!`,
    keywords: ['تأمين', 'Insurance', 'ضمان', 'حماية']
  },
  'فحص فني': {
    answer: `🔧 **الفحص الفني**\n\n• المدة: سنة واحدة\n• السعر: 70 ريال\n• المراكز: فحص المركبات المعتمدة\n\nمعلومة: يجب تجديده قبل انتهاء الاستمارة.`,
    keywords: ['فحص', 'فني', 'inspection', 'صيانة']
  },
  'استمارة': {
    answer: `📄 **استمارة المركبة**\n\n• المدة: سنة واحدة\n• المستندات المطلوبة:\n  - تأمين ساري\n  - فحص فني ساري\n  - سداد المخالفات\n\n⏳ تجديد قبل انتهاء الصلاحية بشهر`,
    keywords: ['استمارة', 'رخصة', 'تجديد', 'istimara']
  },
  'أسعار': {
    answer: `💰 **الأسعار**\n\n• نقل الملكية: 420 ريال\n• تجديد الاستمارة: 300 ريال\n• الفحص الفني: 70 ريال\n• التأمين: يختلف حسب المركبة والنوع\n\n💡 جميع الأسعار شاملة الضريبة`,
    keywords: ['سعر', 'تكلفة', 'كم', 'ثمن', 'أسعار']
  },
  'مستندات': {
    answer: `📋 **المستندات المطلوبة**\n\nلنقل الملكية:\n• استمارة المركبة\n• هوية البائع والمشتري\n• تأمين ساري\n• فحص فني ساري\n\nللتجديد:\n• التأمين\n• الفحص الفني\n• سداد المخالفات`,
    keywords: ['مستندات', 'أوراق', 'وثائق', 'مطلوب']
  },
  'default': {
    answer: `🤖 **مساعد مِلكيتك الذكي**\n\nمرحباً! أنا هنا لمساعدتك في:\n\n• 🚗 نقل ملكية المركبات\n• 📄 تجديد الاستمارة والتأمين\n• 🔧 الفحص الفني\n• 💰 الأسعار والرسوم\n• 📋 المستندات المطلوبة\n\n💡 جرب تسأل عن: "نقل ملكية" أو "تأمين" أو "أسعار"`,
    keywords: []
  }
};

const AIAssistant: React.FC<AIAssistantProps> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: knowledgeBase.default.answer,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const commonQuestions = [
    'كم تكلفة نقل الملكية؟',
    'ما هي المستندات المطلوبة؟',
    'كيف أتتبع معاملتي؟',
    'كم مدة انتهاء الاستمارة؟',
    'أين يمكنني تجديد التأمين؟'
  ];

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const findBestResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // البحث عن أفضل تطابق
    for (const [key, data] of Object.entries(knowledgeBase)) {
      for (const keyword of data.keywords) {
        if (message.includes(keyword.toLowerCase())) {
          return data.answer;
        }
      }
      
      // إذا كان السؤال يحتوي على اسم الموضوع مباشرة
      if (message.includes(key.toLowerCase())) {
        return data.answer;
      }
    }
    
    return knowledgeBase.default.answer;
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    // محاكاة delay علشان يبقى واقعي
    setTimeout(() => {
      const aiResponse = findBestResponse(inputText);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, index) => (
      <Text key={index} style={styles.messageText}>
        {line}
      </Text>
    ));
  };

  if (!visible) return null;

  return (
    <View style={componentStyles.aiAssistant.container}>
      {/* الهيدر */}
      <View style={componentStyles.aiAssistant.header}>
        <View style={componentStyles.aiAssistant.headerInfo}>
          <Ionicons name="sparkles" size={24} color={colors.primary[500]} />
          <Text style={componentStyles.aiAssistant.title}>المساعد الذكي</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={componentStyles.aiAssistant.closeButton}>
          <Ionicons name="close" size={24} color={colors.neutral[500]} />
        </TouchableOpacity>
      </View>

      {/* المحادثة */}
      <KeyboardAvoidingView 
        style={componentStyles.aiAssistant.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollViewRef}
          style={componentStyles.aiAssistant.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                componentStyles.aiAssistant.messageBubble,
                message.isUser 
                  ? componentStyles.aiAssistant.userMessage 
                  : componentStyles.aiAssistant.aiMessage
              ]}
            >
              <View style={componentStyles.aiAssistant.messageContent}>
                {formatMessage(message.text)}
                <Text style={componentStyles.aiAssistant.timestamp}>
                  {message.timestamp.toLocaleTimeString('ar-SA', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
              <View style={componentStyles.aiAssistant.avatar}>
                <Ionicons 
                  name={message.isUser ? "person" : "sparkles"} 
                  size={20} 
                  color={message.isUser ? colors.primary[500] : colors.success[500]} 
                />
              </View>
            </View>
          ))}
          
          {loading && (
            <View style={[componentStyles.aiAssistant.messageBubble, componentStyles.aiAssistant.aiMessage]}>
              <View style={componentStyles.aiAssistant.typingIndicator}>
                <ActivityIndicator size="small" color={colors.primary[500]} />
                <Text style={componentStyles.aiAssistant.typingText}>يكتب...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* الأسئلة السريعة */}
        {messages.length <= 2 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={componentStyles.aiAssistant.quickQuestions}
          >
            {commonQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={componentStyles.aiAssistant.quickQuestionChip}
                onPress={() => handleQuickQuestion(question)}
              >
                <Text style={componentStyles.aiAssistant.quickQuestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* حقل الإدخال */}
        <View style={componentStyles.aiAssistant.inputContainer}>
          <TextInput
            style={componentStyles.aiAssistant.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="اكتب سؤالك هنا..."
            placeholderTextColor={colors.neutral[400]}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              componentStyles.aiAssistant.sendButton,
              (!inputText.trim() || loading) && componentStyles.aiAssistant.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.text.inverse} />
            ) : (
              <Ionicons name="send" size={20} color={colors.text.inverse} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AIAssistant;
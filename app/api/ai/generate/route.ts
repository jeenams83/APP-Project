import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { type, businessName, businessType, context } = await req.json()

  const prompts: Record<string, string> = {
    sms: `당신은 한국 소상공인을 위한 마케팅 전문가입니다.\n다음 정보를 바탕으로 고객에게 보낼 SMS 홍보 메시지를 3가지 작성해주세요.\n\n업종: ${businessType || "음식점"}\n상호명: ${businessName || "우리 가게"}\n추가 정보: ${context || "특별 프로모션"}\n\n조건:\n- 각 메시지는 90자 이내\n- 자연스러운 한국어\n- 친근하면서도 전문적인 톤\n- 명확한 혜택이나 행동 유도 포함\n\n형식: 1. [메시지]\n2. [메시지]\n3. [메시지]`,
    kakao: `당신은 한국 소상공인을 위한 마케팅 전문가입니다.\n다음 정보를 바탕으로 카카오톡 홍보 메시지를 3가지 작성해주세요.\n\n업종: ${businessType || "음식점"}\n상호명: ${businessName || "우리 가게"}\n추가 정보: ${context || "특별 프로모션"}\n\n조건:\n- 각 메시지는 200자 이내\n- 이모지 적극 활용\n- 카카오톡 특유의 친근한 느낌\n\n형식: 1. [메시지]\n2. [메시지]\n3. [메시지]`,
    naver_blog: `당신은 한국 소상공인을 위한 마케팅 전문가입니다.\n다음 정보를 바탕으로 네이버 블로그 포스팅 초안을 작성해주세요.\n\n업종: ${businessType || "음식점"}\n상호명: ${businessName || "우리 가게"}\n추가 정보: ${context || "가게 소개"}\n\n조건:\n- 500~800자 분량\n- SEO 키워드 자연스럽게 포함\n- 제목, 본문, 마무리 구성`,
    instagram: `당신은 한국 소상공인을 위한 마케팅 전문가입니다.\n다음 정보를 바탕으로 인스타그램 캡션을 3가지 작성해주세요.\n\n업종: ${businessType || "음식점"}\n상호명: ${businessName || "우리 가게"}\n추가 정보: ${context || "신메뉴 출시"}\n\n조건:\n- 각 150자 이내\n- 해시태그 10개 포함\n- 이모지 활용\n\n형식: 1. [캡션+해시태그]\n2. [캡션+해시태그]\n3. [캡션+해시태그]`,
    loyalty: `당신은 한국 소상공인을 위한 마케팅 전문가입니다.\n단골 고객에게 보낼 감사 메시지를 3가지 작성해주세요.\n\n업종: ${businessType || "음식점"}\n상호명: ${businessName || "우리 가게"}\n추가 정보: ${context || "단골 고객 감사"}\n\n조건:\n- 진심 어린 감사 표현\n- 90자 이내\n\n형식: 1. [메시지]\n2. [메시지]\n3. [메시지]`,
  }

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompts[type] || prompts.sms }],
  })

  const text = response.content[0].type === "text" ? response.content[0].text : ""
  return NextResponse.json({ text })
}

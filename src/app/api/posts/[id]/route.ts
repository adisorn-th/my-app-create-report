import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id
  return Response.json(await prisma.post.findUnique({
    where: { id: Number(id) },
  }))
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { title, content } = await req.json()
    const id = (await params).id
    return Response.json(await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content },
    }))
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id
    return Response.json(await prisma.post.delete({
      where: { id: Number(id) },
    }))
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}
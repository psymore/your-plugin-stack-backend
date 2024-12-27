-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stack" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "stack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plugin" (
    "id" SERIAL NOT NULL,
    "pluginName" TEXT NOT NULL,

    CONSTRAINT "plugin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stack_plugins" (
    "id" SERIAL NOT NULL,
    "stackId" INTEGER NOT NULL,
    "pluginId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "stack_plugins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "stack_plugins_stackId_pluginId_position_key" ON "stack_plugins"("stackId", "pluginId", "position");

-- AddForeignKey
ALTER TABLE "stack" ADD CONSTRAINT "stack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stack_plugins" ADD CONSTRAINT "stack_plugins_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "stack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stack_plugins" ADD CONSTRAINT "stack_plugins_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "plugin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

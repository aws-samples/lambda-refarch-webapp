# 無伺服器參考架構：Web 應用程式

無伺服器參考架構描述如何使用 [AWS Lambda](http://aws.amazon.com/lambda/) 與 Amazon API Gateway 建立動態 Web 應用程式以驗證與處理 API 要求。

藉由結合 AWS Lambda 與其他 AWS 服務，開發人員可建立強大的 Web 應用程式，以自動擴展與縮減並在跨多個資料中心的高可用性組態中運作，而且無需任何管理作業來處理可擴展性、備份或多重資料中心備援等作業。

此範例著眼於使用 AWS Lambda 與 Amazon API Gateway 建立動態投票應用程式，它可透過簡訊接受投票並將總數彙整至 Amazon DynamoDB，然後利用 Amazon Simple Storage Service (Amazon S3) 即時顯示結果。

使用 AWS CloudFormation 範本可建立此 [示意圖](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda-refarch-webapp.pdf) 所描述的架構。

[範本](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template) 執行以下項目：

- 建立名為 &lt;S3BucketName\> 的 S3 儲存貯體以存放您的 Web 應用程式。
- 建立名為「VoteApp」的 DynamoDB 資料表以存放投票
- 建立名為「VoteAppAggregates」的 DynamoDB 資料表以彙整投票總數
- 建立 Lambda 功能讓您的應用程式接受投票
- 建立 Lambda 功能讓您的應用程式彙整投票
- 家裡 AWS Identity and Access Management (IAM) 角色與政策，讓 Lambda 功能寫入至 Amazon CloudWatch 記錄以及寫入與查詢 DynamoDB 資料表

## 動態儀表板

利用此儲存庫中的 HTML、JavaScript 及 CSS 建立的 HTML 網頁「index.html」，可測試 AWS CloudFormation 範本所設定的服務與資源。您可以將這些檔案複製至 AWS CloudFormation 指令碼所建立的 S3 儲存貯體中。

## 說明
**重要：** 系統提供的 CloudFormation 範本會從 us-east-1 區域的儲存貯體取回其 Lambda 程式碼。若要在其他區域啟動此範例，請修改範本並將 Lambda 程式碼上傳至該區域的儲存貯體。

此範例示範透過使用者以電話號碼傳送的文字訊息以接受投票。若要複製此架構所建立的系統，您必須透過第三方設定電話號碼，例如 [Twilio](http://twilio.com)。如需完整的詳細資訊，請參閱 [AWS Startup Collection at Medium](https://medium.com/aws-activate-startup-blog) 上的 [我們的文章](https://medium.com/aws-activate-startup-blog/building-dynamic-dashboards-using-aws-lambda-and-amazon-dynamodb-streams-part-ii-b2d883bebde5) 。

步驟 1 – 使用 [範本](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template) 建立 AWS CloudFormation 堆疊，堆疊的名稱請使用小寫字母。

步驟 2 – 造訪您的 AWS 帳戶中的 [API Gateway 儀表板](https://console.aws.amazon.com/apigateway/home) 並以「/vote」終端節點建立新的資源。指派具有「整合要求」類型「Lambda 功能」的 POST 方法，然後指向由接受來自第三方投票服務 (例如 Twilio) 的投票的 AWS CloudFormation 指令碼建立的 Lambda 功能。

在「對應範本」之下，將「Content-Type」設定為「application/x-www-form-urlencoded」，然後新增 [此對應範本](apigateway-mappingtemplate.txt)。

步驟 3 – 造訪 [Amazon Cognito 儀表板](https://console.aws.amazon.com/cognito/home) 並建立新的允許存取未授權的身分的 Identity Pool。修改政策文件以允許讀取存取上述 AWS CloudFormation 指令碼建立的彙整 DynamoDB 資料表。如此可允許未經驗證的使用者從 DynamoDB 中的投票彙整資料表取回資料。Amazon Cognito 將提供此 JavaScript 平台的範本程式碼。請記下 Identity Pool ID 數值，您將會在步驟 4 使用此數值。

步驟 4 – 將此儲存庫的 HTML、CSS 及 JS 檔案複製至建立用來存放您的儀表板的靜態 S3 儲存貯體。您將必須開啟「refresh.js」並以您自己的數值取代「region」與「identity-pool-id」的預設值。

恭喜您！您想在應該已經擁有可運作的參考架構範例。您可以即時接受投票、調整您的 DynamoDB 以處理不同層級的外來流量，以及在您的儀表板即時觀察結果的變化。

## 請注意

AWS CloudFormation 指令碼將為您建立兩個 DynamoDB 資料表。雖然您可以透過 AWS CloudFormation 指令碼指定讀取與寫入容量，但無法指定指令碼中的資料表名稱。這是因為接受與彙整投票的 JavaScript 程式碼必須事先知道資料表的名稱 (_VoteApp_ 與 _VoteAppAggregates_)。如果您要變更您的 DynamoDB 資料表的名稱，請務必變更其在 JavaScript 檔案中的名稱，其位於可在 [彙整原始碼](/lambda-functions/aggregate-votes/) 與 [接受原始碼](/lambda-functions/receive-vote/) 中找到的程式碼。

## 清除

若要移除所有已自動建立的資源，請刪除 AWS CloudFormation 堆疊。您必須手動移除 API Gateway 終端節點與 Amazon Cognito Identity Pool。

注意：除非在刪除堆疊之前已移除儲存貯體中的所有檔案，否則刪除 S3 儲存貯體將會失敗。

## 授權

此參考架構範例依據 Apache 2.0 授權。

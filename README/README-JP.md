# サーバーレスリファレンスアーキテクチャ: ウェブアプリケーション

[AWS Lambda](http://aws.amazon.com/lambda/) および Amazon API Gateway を使用して API リクエストを認証、処理する動的なウェブアプリケーションを構築する方法を示すサーバーレスリファレンスアーキテクチャ。

開発者は、AWS Lambda を他の AWS サービスと組み合わせることにより、自動的にスケールアップおよびスケールダウンし、複数のデータセンター間で可用性の高い設定で実行される強力なウェブアプリケーションを構築できます。スケーラビリティ、バックアップ、または複数のデータセンターの冗長性について運用管理の手間は一切かかりません。

この例では、AWS Lambda と Amazon API Gateway を使用して動的な投票アプリケーションを構築する方法を示します。このアプリケーションは SMS 経由で投票を受け取り、合計を Amazon DynamoDB に集計し、Amazon Simple Storage Service (Amazon S3) を使用して結果をリアルタイムで表示します。

この [図](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda-refarch-webapp.pdf) に示すアーキテクチャは、AWS CloudFormation テンプレートを使用して作成できます。

[テンプレート](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template) は以下を実行します。

- ウェブアプリを保持するための &lt;S3BucketName\> という S3 バケットを作成する
- 投票を保存するための `VoteApp` という名前の DynamoDB テーブルを作成する
- 投票の合計を集計するための `VoteAppAggregates` という名前の DynamoDB テーブルを作成する
- アプリケーションが投票を受け取れるようにする Lambda 関数を作成する
- アプリケーションが投票を集計できるようにする Lambda 関数を作成する
- Lambda 関数が Amazon CloudWatch ログへの書き込み、および DynamoDB テーブルへの書き込みとクエリを実行できるようにする AWS Identity and Access Management (IAM) ロールとポリシーを作成する

## 動的ダッシュボード

AWS CloudFormation テンプレートで設定されたサービスとリソースは、HTML ページ `index.html` でテストできます。このページは、このレポにある HTML、JavaScript、および CSS ファイルに依存します。AWS CloudFormation スクリプトによって作成された S3 バケットに、これらのファイルをコピーできます。

## 手順
**重要:** 用意された CloudFormation テンプレートは、us-east-1 region リージョンのバケットからその Lambda コードを取得します。別のリージョンでこのサンプルを起動するには、テンプレートを変更し、そのリージョンのバケットに Lambda コードをアップロードします。

この例では、電話番号でユーザーからテキストメッセージを通じて投票を受け取ります。このアーキテクチャによって構築されたシステムを複製するには、[Twilio](http://twilio.com) などのサードパーティーを使って電話番号を設定する必要があります。詳細については、[AWS Startup Collection at Medium](https://medium.com/aws-activate-startup-blog) の [投稿](https://medium.com/aws-activate-startup-blog/building-dynamic-dashboards-using-aws-lambda-and-amazon-dynamodb-streams-part-ii-b2d883bebde5)  を参照してください。

ステップ 1 – スタック用に小文字を使い、[テンプレート](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template) で AWS CloudFormation スタックを作成します。

ステップ 2 – AWS アカウントの [API Gateway ダッシュボード](https://console.aws.amazon.com/apigateway/home) にアクセスし、`/vote` エンドポイントで新しいリソースを作成します。`Integration Request` タイプの "Lambda 関数" を持つ POST メソッドを割り当て、サードパーティーの投票サービス (この例では Twilio) から投票を受け取る AWS CloudFormation スクリプトによって作成された Lambda 関数を指定します。

`Mapping Templates` で、"Content-Type" を application/x-www-form-urlencoded` に設定し、[このマッピングテンプレート](apigateway-mappingtemplate.txt) を追加します。

ステップ 3 - [Amazon Cognito ダッシュボード](https://console.aws.amazon.com/cognito/home) にアクセスし、認証されていない ID へのアクセスを許可する新しい ID プールを作成します。上記の AWS CloudFormation スクリプトによって作成された DynamoDB テーブルを集計するための読み取りアクセスを許可するポリシードキュメントを変更します。これにより、認証されていないユーザーが DynamoDB の投票集計テーブルからデータを受け取ることができます。Amazon Cognito が、JavaScript プラットフォーム用のサンプルコードを提供します。ID プール ID の値をメモしておきます。これはステップ 4 で必要になります。

ステップ 4 – このレポから、ダッシュボードを保持するために作成された静的な S3 バケットに HTML、CSS、および JS ファイルをコピーします。`refresh.js` を開き、`region` および `identity-pool-id` のデフォルト値を独自の値に置き換える必要があります。

おめでとうございます。これで、リファレンスアーキテクチャの例が完成しました。リアルタイムで投票を受け取り、DynamoDB テーブルを調整してさまざまなレベルの受信トラフィックを処理し、結果の変化をダッシュボードでリアルタイムに見ることができます。

## 注目すべき点

AWS CloudFormation スクリプトでは、2 つの DynamoDB テーブルが作成されます。AWS CloudFormation スクリプトを通じて読み取りおよび書き込みキャパシティーを指定できますが、スクリプトでテーブル名を指定することはできません。これは、投票を受け取り集計する JavaScript コードが、そのテーブル名 (_VoteApp_ and _VoteAppAggregates_) を事前に知る必要があるためです。DynamoDB テーブルの名前を変更する場合は、必ず [集計ソース](/lambda-functions/aggregate-votes/) および [宛先ソース](/lambda-functions/receive-vote/) の両方にあるコードで JavaScript ファイル自体の名前を変更してください。

## クリーンアップ

自動的に作成されたすべてのリソースを削除するには、AWS CloudFormation スタックを削除します。API Gateway エンドポイントと Amazon Cognito ID プールを手動で削除する必要があります。

注意: スタックを削除する前にバケットのすべてのファイルを削除していないと、S3 バケットの削除は失敗します。

## ライセンス

このリファレンスアーキテクチャサンプルは Apache 2.0 でライセンスされています。

# 概要

メタデータAPIから動的にカスタムボタン（リンク）を作る方法をご紹介します

# 方法

JSfoceを経由してMetadataApiでカスタムボタンを作ります
作り方はパラメータを渡すだけでハマるところはないですが、ボタンのfullNameに何を入れていいのかがわからなかった
また、名前空間がある組織では名前空間名を含めてあげる必要がところがポイントです

※サンプルコードのままでは名前空間に対応していないため、修正してから使ってください
　名前空間を含める箇所はソースコードに記載してあります

# サンプルコード

[こちら](https://github.com/comefigo/make-sfdc-custom-button-sample)をベースに紹介したいと思います

Visualforce Pageで試す方法と無駄にDockerでローカルから試す方法を用意していますｗ

- Visualforceの場合は「src」-「pages」-「MakeCustomButtonSample.page」を参照してください
- ローカル with Dockerは「app」-「static」-「index.html」を参照してください  
  Docker版の使い方は[ローカルでSalesforce アプリケーション開発 with Docker](http://qiita.com/comefigo/items/d819f8bb36d3b404204a)をご参照ください

```visualforce:MakeCustomButtonSample.page
<apex:page standardStylesheets="false" showHeader="false" sidebar="false">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.2.6/vue.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jsforce/1.7.1/jsforce.min.js"></script>
    
    <div id="app">
        <h1>create salesforce custombutton from jsforce</h1>
        <h1 v-if="ok" style="color: #4cae4c;">succeeded !!</h1>
        <h1 v-if="ng" style="color: #d43f3a;">faild... plz check console log</h1>

        <h3>オブジェクト名：</h3>
        <select v-model="btnObject">
            <OPTION value="Account" selected="selected">取引先</OPTION>
            <OPTION value="Lead">リード</OPTION>
            <OPTION value="Contact">取引先責任者</OPTION>
        </select>
        <h3>ボタンAPI名：</h3>
        <input type="text" v-model="btnName"/>
        <h3>ボタンラベル名：</h3>
        <input type="text" v-model="btnLabel"/>
        <br/>
        <button onclick="makeButton();">button作成</button>
        <button onclick="deleteButton();">button削除</button>
    </div>
    
    <script>
        jsfConn = new jsforce.Connection({ accessToken: '{!$Api.Session_Id}'});
    
        // 対象オブジェクト
        const btnConfig = new Vue({
            el: '#app',
            data: {
                btnObject: 'Account',
                btnName: '',
                btnLabel: '',
                ok: false,
                ng: false
            }
        });
    
        function init() {
            btnConfig.ng = false;
            btnConfig.ok = false;
        }
    
        // ボタン作成
        function makeButton() {
            init();
            if(!btnConfig.btnObject || !btnConfig.btnName || !btnConfig.btnLabel || !connected) {
                return false;
            }
    
            jsfConn.metadata.upsert('WebLink', [new WebLinkObject(btnConfig.btnObject, btnConfig.btnName, btnConfig.btnLabel)]).then(function(result) {
                console.log(result);
                result.success ? btnConfig.ok = result.success : btnConfig.ng = !result.success;
            }).catch(function(error) {
                console.error(error);
                btnConfig.ng = true;
            });
        }
    
        // ボタン削除
        function deleteButton() {
            init();
            jsfConn.metadata.delete('WebLink', [btnConfig.btnObject + '.' + btnConfig.btnName], function(err, result) {
                console.log(result);
                result.success ? btnConfig.ok = result.success : btnConfig.ng = !result.success;
            }).catch(function(error) {
                console.error(error);
                btnConfig.ng = true;
            });
        }
    
        // カスタムボタン用のオブジェクト
        function WebLinkObject(strObjectName, strBtnName, strBtnLabel) {
            // fullNameの基本形式は「オブジェクト名.ボタンAPI名」
            //
            // 名前空間を所有する組織では、
            // カスタムオブジェクト名とボタンAPI名に名前空間名を含める必要があります
            // 「名前空間名__カスタムオブジェクト名.名前空間名__ボタンAPI名」になります
            // 標準オブジェクトが対象の場合は、
            // 「オブジェクト名.名前空間名__ボタンAPI名」になります
            // 
            //   ※新規作成時は「オブジェクト名.ボタンAPI名」のみで問題ないが、
            //     編集・削除時には名前空間名を含めたfullNameであること
            this.fullName = strObjectName + '.' + strBtnName;
            this.availability = 'online';
            // massActionButton   リストビューのボタン
            // button   詳細画面のボタン
            this.displayType = 'button';
            this.encodingKey = 'UTF-8';
            this.linkType = "javascript";
            this.masterLabel = strBtnLabel;
            this.openType = "onClickJavaScript";
            this.protected = false;
            // javascriptコード
            this.url = 'console.log(\' click custom button ! \')';
            this.description = 'description of custom button.';
        }
    </script>
</apex:page>
```

# WebLinkのリファレンス

https://developer.salesforce.com/docs/atlas.ja-jp.206.0.api_meta.meta/api_meta/meta_weblink.htm?search_text=weblink



